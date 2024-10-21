//database/sync.js
import store from '../redux/store'; // Adjust the path
import { setNotification } from '../redux/slices/notificationSlice'; // Import your notification actions
import {getDeviceDetails} from "../components/devOptions";
import {auth, myFirestoreDb} from "../database/firebase";
import { collection, doc, addDoc, setDoc, deleteDoc } from "firebase/firestore";
import {openDB,addToObjectStore, addToObjectStoreExec, appDefaultConfData, checkIfDatabaseExists, clearAllDataExec, createDatabase, deleteFromObjectStore, deleteFromObjectStoreExec, getAllObjectStoreData, getAllObjectStoreDataExec, getLastIdAndSet, getObjectStoreData, getObjectStoreDataExec, handleAddToDatastoreObject, handleClearData, handleRemoveDatabase, removeDatabaseExec, updateObjectStore, updateObjectStoreExec} from "./indexedDB";

export function dispatchSyncEvent(syncStatus) {
  const event = new CustomEvent('syncStatusUpdate', { detail: syncStatus });
  window.dispatchEvent(event);
}

export async function syncToFirestore() {
  try {
    const db = await openDB();
    const transaction = db.transaction('sync_table', 'readwrite');
    const store = transaction.objectStore('sync_table');

    const pendingRequest = store.getAll();

    pendingRequest.onsuccess = async (event) => {
      const pendingRecords = event.target.result;
      console.log('Syctofirestore pendingRecords :', pendingRecords);
      if (pendingRecords && pendingRecords.length > 0) {
        let allSynced = true;
        let partiallySynced = false;

        for (const syncRecord of pendingRecords) {
          if (syncRecord.status === 'pending') {
            const {  operation, tableName, indexedDBId, firestoreId } = syncRecord;
            const myId = syncRecord.id;
            const tableTransaction = db.transaction(tableName, 'readonly');
            const tableStore = tableTransaction.objectStore(tableName);
            console.log('Syctofirestore syncRecord :', syncRecord);
            const dataRequest = tableStore.get(indexedDBId);

            dataRequest.onsuccess = async (event) => {
              const data = event.target.result;
              const user = auth.currentUser;

              if (user && data) {
                // Call the Firestore operation
                console.log("performFirestoreOperation : ", myId, operation, tableName, indexedDBId, firestoreId, data);
                await performFirestoreOperation(myId, operation, tableName, indexedDBId, firestoreId, data);               
              } 
            };

            dataRequest.onerror = (event) => {
              console.error(`Error fetching data from ${tableName}:`, event.target.error);
              allSynced = false;
            };
          }
        }

        // Dispatch the sync event based on the status
        const syncStatus = allSynced ? 'complete' : partiallySynced ? 'incomplete' : 'pending';
        dispatchSyncEvent(syncStatus);
      } else {
        console.log('No pending sync records found');
        dispatchSyncEvent('complete');
      }
    };

    pendingRequest.onerror = (event) => {
      console.error('Error fetching sync records:', event.target.error);
      dispatchSyncEvent('pending');
    };
  } catch (error) {
    console.error('Error in syncToFirestore:', error);
    dispatchSyncEvent('pending');
  }
}


export const retryUpdateSyncRecordStatus = (myId, indexedDBId, firestoreId, newStatus, retries = 5, delay = 2000) => {
  let attempts = 0;

  const attemptUpdate = async () => {
    attempts += 1;
    console.log(`Attempt ${attempts} to update sync record...`);

    try {
      const result = await updateSyncRecordStatus(myId, indexedDBId, firestoreId, newStatus);

      if (result) {
        console.log('Record updated successfully!');
      } else {
        if (attempts < retries) {
          console.log(`Retrying in ${delay / 1000} seconds...`);
          setTimeout(attemptUpdate, delay); // Retry after the delay
        } else {
          console.log('Max retry attempts reached. Update failed.');
        }
      }
    } catch (error) {
      console.error('Error updating sync record:', error);

      if (attempts < retries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        setTimeout(attemptUpdate, delay); // Retry after the delay
      } else {
        console.log('Max retry attempts reached. Update failed.');
      }
    }
  };

  attemptUpdate(); // Start the first attempt
};


// Call the updateSyncRecordStatus function and log the result
export const testUpdateSyncRecordStatus = async (myId, indexedDBId, firestoreId, newStatus) => {
  try {
    // First attempt to update the sync record
    const updateResult = await updateSyncRecordStatus(myId, indexedDBId, firestoreId, newStatus);

    if (updateResult) {
      console.log('updateSyncRecordStatus function called successfully');
      return true;  // Return true if the operation succeeds
    } else {
      console.log('Initial attempt failed, retrying...');
      // Call retryUpdateSyncRecordStatus if the first attempt fails
      retryUpdateSyncRecordStatus(myId, indexedDBId, firestoreId, newStatus, 5, 20000);
      return false; // Return false as the first attempt failed, but retries will be attempted
    }
  } catch (error) {
    console.error('Error calling updateSyncRecordStatus:', error);
    // Call retryUpdateSyncRecordStatus in case of an exception during the first attempt
    retryUpdateSyncRecordStatus(myId, indexedDBId, firestoreId, newStatus, 5, 2000);
    return false; // Return false because the operation initially failed
  }
};


// Function to perform the respective Firestore operation (add, update, delete)
export async function performFirestoreOperation( myId, operation, tableName, indexedDBId, firestoreId, data) {
  const db = await openDB(); // Wait for the database to open
  try {
    if (operation === 'add') {
      // Adding a document to Firestore
      const docRef = await addDoc(collection(myFirestoreDb, tableName), data);
      console.log('Data data:',  data);
      if(docRef.id){
      const SyncReturnUpdate = testUpdateSyncRecordStatus(myId,indexedDBId,docRef.id, "synced"); 
    }
      return { firestoreId};
    } else if (operation === 'update') {
      console.log("performFirestoreOperation : ", indexedDBId);
      try {
        // Step 1: Fetch the Firestore ID from IndexedDB
               
        const transaction = db.transaction('sync_table', 'readonly');
        const syncTable = transaction.objectStore('sync_table');
        const request = syncTable.index('indexedDBId').get(indexedDBId);
      
        request.onsuccess = async (event) => {
          const record = event.target.result;
          if (record && record.status === 'synced') {
            const firestoreId = record.firestoreId;
    
            if (!firestoreId) {
              console.error('Cannot update: firestoreId is null or undefined.');
              return;
            }
    
            // Step 2: Update the document in Firestore using the Firestore ID
             
            
            const updateResult = await setDoc(doc(myFirestoreDb, tableName, firestoreId), data, { merge: true });
            console.log('before update stauts:', myId, indexedDBId, firestoreId, "synced");

            // Use the Firestore ID in the update sync status function
            testUpdateSyncRecordStatus(myId, indexedDBId, firestoreId, "synced");



              return { firestoreId};
            // Return the Firestore ID for further processing if needed
            return { firestoreId };
          } else {
            console.error('Cannot update: No synced record found with the specified indexedDBId.');
          }
        };
    
        request.onerror = (event) => {
          console.error('Error fetching record from IndexedDB:', event.target.error);
        };
    
      } catch (error) {
        console.error('Error during update operation:', error);
      }
    }
    else if (operation === 'delete') {

        const firestoreId = await getFirestoreIdFromSyncTableExec(tableName, indexedDBId);
        let firestoreRecordDeleted = null;
        if (firestoreId) {
          console.log('Successfully retrieved Firestore ID:', firestoreId);
          try {
            // Construct the Firestore document reference
            const documentRef = doc(myFirestoreDb, tableName, firestoreId);      
            // Attempt to delete the document
            await deleteDoc(documentRef);      
            // Log success message
            console.log(`Document with ID ${firestoreId} from ${tableName} deleted successfully.`);          
            // Return a confirmation that the document was deleted
            firestoreRecordDeleted=true;      
          } catch (error) {
            // Handle and log any errors during the deletion process
            console.error(`Failed to delete document with ID ${firestoreId} from ${tableName}:`, error);          
            // Return false to indicate failure
            firestoreRecordDeleted=false;
          }
        } else {
          console.log('No matching Firestore ID found, or an error occurred.');
        }

        
        
      /*console.log("Deleted object indexedDBId... : ",indexedDBId);
      const myDeletedObject = await getObjectStoreDataExec("sync_table",indexedDBId);
      console.log("myDeletedObject ... : ",myDeletedObject);
      const firestoreId = myDeletedObject.firestoreId;
      const firestoreCollection = myDeletedObject.tableName;
      console.log("firestore Id... : ",firestoreId);
      try {
        // Perform the delete operation
        await deleteDoc(doc(myFirestoreDb, firestoreCollection, firestoreId));
        
        // If the delete succeeds, log success message
        console.log(`Document with ID ${firestoreId} from ${tableName} deleted successfully.`);
        return { firestoreId };
      } catch (error) {
        // If the delete fails, log the error
        console.error(`Failed to delete document with ID ${firestoreId} from ${tableName}:`, error);
      }*/
      
      /*try {
        // Step 1: Fetch the Firestore ID from IndexedDB
        const transaction = db.transaction('sync_table', 'readonly');
        const syncTable = transaction.objectStore('sync_table');
        const request = syncTable.index('indexedDBId').get(indexedDBId);
    
        request.onsuccess = async (event) => {
          const record = event.target.result;
          if (record && record.status === 'synced') {
            const firestoreId = record.firestoreId;
    
            if (!firestoreId) {
              console.error('Cannot delete: firestoreId is null or undefined.');
              return;
            }
    
            // Step 2: delete the document in Firestore using the Firestore ID
            await deleteDoc(doc(myFirestoreDb, tableName, firestoreId), data, { merge: true });
            console.log('Data deleted from Firestore');
    
            // Return the Firestore ID for further processing if needed
            return { firestoreId };
          } else {
            console.error('Cannot delete: No synced record found with the specified indexedDBId.');
          }
        };
    
        request.onerror = (event) => {
          console.error('Error fetching record from IndexedDB:', event.target.error);
        };
    
      } catch (error) {
        console.error('Error during delete operation:', error);
      }*/
    }
  } catch (error) {
    console.error('Error performing Firestore operation:', error);
    throw error; // Re-throw error to handle it later
  }
}

// Helper function to update sync record status in IndexedDB
export async function updateSyncRecordStatus(myId, syncRecordId, firestoreId, newStatus) {
  console.log("Attempting to update sync record:", myId, syncRecordId, firestoreId, newStatus);

  try {
    const db = await openDB();
    const transaction = db.transaction('sync_table', 'readwrite');
    const store = transaction.objectStore('sync_table');

    const getRequest = store.get(myId);

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = (event) => {
        console.log("DB request successful");
        const syncRecord = event.target.result;
        console.log("get Request", getRequest);
        if (syncRecord) {
          const checkIndexedDBId = syncRecord.indexedDBId;
          console.log("indexedDBId:", checkIndexedDBId);
          console.log("syncRecordId:", syncRecordId);
          syncRecord.status = newStatus;
          syncRecord.firestoreId = firestoreId; // Update Firestore ID if necessary
          syncRecord.lastSyncAttempt = Date.now();

          const putRequest = store.put(syncRecord);

          putRequest.onsuccess = () => {
            console.log("Sync record status updated successfully");
            resolve(true); // Record successfully updated
          };

          putRequest.onerror = (event) => {
            console.error("Error updating sync record status:", event.target.error);
            reject(false); // Failed to update record
          };
        } else {
          console.error("No sync record found with ID:", syncRecordId);
          resolve(false); // No record found
        }
      };

      getRequest.onerror = (event) => {
        console.error("Error retrieving sync record for update:", event.target.error);
        reject(false); // Failed to retrieve record
      };
    });
  } catch (error) {
    console.error("Error updating sync record status:", error);
    return false; // Handle any other errors
  }
}




// Function to log a sync operation after a CRUD action
export async function logSyncOperation(operationData, tableNameData, indexedDBIdData, firestoreIdData) {
  console.log('Attempting to log sync operation');
  console.log('Operation:', operationData);
  console.log('Table Name:', tableNameData);
  console.log('IndexedDB ID:', indexedDBIdData);  // Add this log
  console.log('Firestore ID:', firestoreIdData);
  if (!indexedDBIdData) {
    console.error('indexedDBId is undefined or null, cannot proceed with logging sync operation');
    return; // Exit the function to avoid logging an invalid sync record
  }
  try {
    const db = await openDB(); // Wait for the database to open
    const transaction = db.transaction('sync_table', 'readwrite');
    const store = transaction.objectStore('sync_table');

    const syncRecord = {
      operation: operationData,  // 'add', 'update', 'delete'
      tableName: tableNameData,  // Name of the table affected in IndexedDB
      indexedDBId: indexedDBIdData, // ID of the record in IndexedDB
      firestoreId: firestoreIdData, // Firestore ID (null if not yet synced)
      status: 'pending',          // Sync status
      timestamp: Date.now(),
      retryCount: 0,
      lastSyncAttempt: null
    };

    console.log("syncRecord");
    console.log(syncRecord);

    const addRequest = store.add(syncRecord);

    addRequest.onsuccess = async () => {
      console.log("Sync record added successfully");

      // After the sync record is successfully added, check if the user is online
      if (navigator.onLine) {
        console.log("User is online, starting data transfer to Firestore");
        try {
          // Trigger your data transfer function here (e.g., syncToFirestore)
          await syncToFirestore();
          console.log("Data successfully transferred to Firestore");
        } catch (error) {
          console.error("Error transferring data to Firestore:", error);
        }
      } else {
        console.log("User is offline, data will be transferred once online");
      }
    };

    addRequest.onerror = (event) => {
      console.error("Error adding sync record:", event.target.error);
      showNotification("Error adding sync record", 'Error');
    };

    transaction.oncomplete = () => {
      console.log("Transaction completed successfully");
    };

    transaction.onerror = (event) => {
      console.error("Transaction error:", event.target.error);
      showNotification("Transaction failed", 'Error');
    };

  } catch (error) {
    console.error("Error in logSyncOperation:", error);
    showNotification("Erreur de connexion", 'Error');
    throw error; // Rethrow error for further handling
  }
}

export const showNotification = (message, type) => {
  // Dispatch a Redux action to show the notification
  store.dispatch(setNotification({ message, type }));
};


async function getFirestoreIdFromSyncTable(tableName,indexedDBId) {
  const db = await openDB(); // Open the IndexedDB
  const transaction = db.transaction('sync_table', 'readonly');
  const objectStore = transaction.objectStore('sync_table');

  // Use a cursor to iterate over the records
  const cursorRequest = objectStore.openCursor();
  
  return new Promise((resolve, reject) => {
    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      
      if (cursor) {
        const record = cursor.value;

        // Check if the record meets all the conditions
        if (
          record.operation === "add" &&
          record.status === "synced" &&
          record.tableName === tableName &&
          record.indexedDBId === indexedDBId
        ) {
          // Resolve the promise with the firestoreId
          resolve(record.firestoreId);
        } else {
          // Continue to the next record if conditions don't match
          cursor.continue();
        }
      } else {
        // If no matching record is found, reject the promise
        reject(new Error('No matching record found.'));
      }
    };

    cursorRequest.onerror = (event) => {
      reject(new Error('Error occurred during cursor iteration: ' + event.target.error));
    };
  });
}

export async function getFirestoreIdFromSyncTableExec(tableName, indexedDBId) {
  try {
    // Call the function and await the result
    const firestoreId = await getFirestoreIdFromSyncTable(tableName, indexedDBId);
    console.log('Found firestoreId:', firestoreId);
    
    // Return the result (can be stored in a constant outside)
    return firestoreId;
  } catch (error) {
    // Log the error and return null or undefined
    console.error('Error in fetching Firestore ID:', error);
    return null; // or undefined
  }
}


