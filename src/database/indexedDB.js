//database/indexedDB.js
import store from '../redux/store'; // Adjust the path
import { setNotification } from '../redux/slices/notificationSlice'; // Import your notification actions
//import {getDeviceDetails} from "../components/devOptions";
import {auth, myFirestoreDb} from "../database/firebase";
import { collection, doc, addDoc, setDoc, deleteDoc } from "firebase/firestore";
import {syncToFirestore, dispatchSyncEvent, retryUpdateSyncRecordStatus, testUpdateSyncRecordStatus, performFirestoreOperation, updateSyncRecordStatus, logSyncOperation,} from "./sync.js"
import {checkBeforeCRUD} from "./verification.js"

const DB_NAME = 'BAR_MAN_PRO_DB';
const DB_VERSION = 1;
let db;

export const showNotification = (message, type) => {
  // Dispatch a Redux action to show the notification
  store.dispatch(setNotification({ message, type }));
};


// Function to check if the database exists
const checkIfDatabaseExists = () => {
  console.log("Checking if the database exists...");

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = function(event) {
      console.log("Database exists, connection successful.");
      const db = event.target.result;
      db.close();
      resolve(true); // Database exists
    };

    request.onupgradeneeded = function(event) {
      console.log("Database upgrade needed or doesn't exist. Aborting transaction.");
      event.target.transaction.abort();
      resolve(false); // Database does not exist
    };

    request.onerror = function(event) {
      console.error("Erreur occurred while checking database existence:", event.target.error);
      resolve(false); // Error occurred
    };

    request.onblocked = function(event) {
      console.warn("Database check blocked by another process:", event.target.error);
      reject(new Error("Database check blocked."));
    };

    request.onabort = function(event) {
      console.warn("Transaction was aborted:", event.target.error);
      reject(new Error("Transaction aborted."));
    };

    // Adding a timeout as a safety measure
    setTimeout(() => {
      console.warn("Database check request timed out.");
      reject(new Error("Database check timed out."));
    }, 15000); // 5-second timeout for the request
  });
};


export { checkIfDatabaseExists };


async function upgradeDatabase(event) {
  
  // Setup database schema if it does not exist
  const db = event.target.result;

            // Create 'Locations' object store if it doesn't exist
              if (!db.objectStoreNames.contains('Locations')) {
                  const store = db.createObjectStore('Locations', { keyPath: 'id', autoIncrement: true });
                  
                  // Indexes for location hierarchy
                  store.createIndex('country', 'country', { unique: false });
                  store.createIndex('state', 'state', { unique: false });
                  store.createIndex('province', 'province', { unique: false });
                  store.createIndex('town', 'town', { unique: false });
                  store.createIndex('area', 'area', { unique: false });

                  // Optional: Add index for region level or other location-specific attributes
                  store.createIndex('region', 'region', { unique: false }); // Optional if needed
                  store.createIndex('postalCode', 'postalCode', { unique: false }); // Optional
              }
              // Create object stores for locations
             /* const countriesStore = db.createObjectStore('countries', { keyPath: 'id', autoIncrement: true });
              countriesStore.createIndex('name', 'name', { unique: true });

              const provincesStore = db.createObjectStore('provinces', { keyPath: 'id', autoIncrement: true });
              provincesStore.createIndex('name', 'name', { unique: false });
              provincesStore.createIndex('countryId', 'countryId');

              const areasStore = db.createObjectStore('areas', { keyPath: 'id', autoIncrement: true });
              areasStore.createIndex('name', 'name', { unique: false });
              areasStore.createIndex('provinceId', 'provinceId');

              const townsStore = db.createObjectStore('towns', { keyPath: 'id', autoIncrement: true });
              townsStore.createIndex('name', 'name', { unique: false });
              townsStore.createIndex('areaId', 'areaId');*/

            // Create app_conf object store
            if (!db.objectStoreNames.contains('app_conf')) {
              const appConfStore = db.createObjectStore('app_conf', { keyPath: 'id', autoIncrement: true });
              appConfStore.createIndex('mode', 'mode', { unique: false });
              appConfStore.createIndex('mainScreen', 'mainScreen', { unique: false });
              appConfStore.createIndex('status', 'status', { unique: false });
              appConfStore.createIndex('deviceId', 'deviceId', { unique: false });
              appConfStore.createIndex('deviceName', 'deviceName', { unique: false });
              appConfStore.createIndex('os', 'os', { unique: false });
              appConfStore.createIndex('manufacturer', 'manufacturer', { unique: false });
              appConfStore.createIndex('model', 'model', { unique: false });
              appConfStore.createIndex('lastSyncDate', 'lastSyncDate', { unique: false });
              appConfStore.createIndex('barId', 'barId', { unique: false });
            }
      
            // Create 'sync_table' object store if it doesn't exist
            if (!db.objectStoreNames.contains('sync_table')) {
              const syncStore = db.createObjectStore('sync_table', { keyPath: 'id', autoIncrement: true });
              syncStore.createIndex('operation', 'operation', { unique: false });
              syncStore.createIndex('tableName', 'tableName', { unique: false });
              syncStore.createIndex('indexedDBId', 'indexedDBId', { unique: false });
              syncStore.createIndex('firestoreId', 'firestoreId', { unique: false });
              syncStore.createIndex('timestamp', 'timestamp', { unique: false });
              syncStore.createIndex('status', 'status', { unique: false });
              syncStore.createIndex('retryCount', 'retryCount', { unique: false });
              syncStore.createIndex('lastSyncAttempt', 'lastSyncAttempt', { unique: false });
            }
      
            // Create 'GapReports' object store if it doesn't exist
          if (!db.objectStoreNames.contains('GapReports')) {
            const store = db.createObjectStore('GapReports', { keyPath: 'id', autoIncrement: true });
            store.createIndex('barId', 'barId', { unique: false });
            store.createIndex('userId', 'userId', { unique: false });
            store.createIndex('gapType', 'gapType', { unique: false });
            store.createIndex('detectedAt', 'detectedAt', { unique: false });
            store.createIndex('amount', 'amount', { unique: false });
            store.createIndex('description', 'description', { unique: false });
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('validatedBy', 'validatedBy', { unique: false });
            store.createIndex('validationDate', 'validationDate', { unique: false });
            store.createIndex('notes', 'notes', { unique: false });
          }
      
          // Create 'StoreChecks' object store if it doesn't exist
          if (!db.objectStoreNames.contains('StoreChecks')) {
            const store = db.createObjectStore('StoreChecks', { keyPath: 'id', autoIncrement: true });
            store.createIndex('barId', 'barId', { unique: false });
            store.createIndex('userId', 'userId', { unique: false });
            store.createIndex('checkType', 'checkType', { unique: false });
            store.createIndex('checkTime', 'checkTime', { unique: false });
            store.createIndex('stockLevels', 'stockLevels', { unique: false });
            store.createIndex('notes', 'notes', { unique: false });
          }
      
          // Create 'Documents' object store if it doesn't exist
          if (!db.objectStoreNames.contains('Documents')) {
            const store = db.createObjectStore('Documents', { keyPath: 'id', autoIncrement: true });
            store.createIndex('userId', 'userId', { unique: false });
            store.createIndex('fileName', 'fileName', { unique: false });
            store.createIndex('filePath', 'filePath', { unique: false });
            store.createIndex('fileType', 'fileType', { unique: false });
            store.createIndex('reportType', 'reportType', { unique: false });
            store.createIndex('barId', 'barId', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
            store.createIndex('shared', 'shared', { unique: false });
            store.createIndex('sharedWith', 'sharedWith', { unique: false });
          }
      
          // Create 'Sessions' object store if it doesn't exist
          if (!db.objectStoreNames.contains('Sessions')) {
            const store = db.createObjectStore('Sessions', { keyPath: 'id', autoIncrement: true });
            store.createIndex('barId', 'barId', { unique: false });
            store.createIndex('userId', 'userId', { unique: false });
            store.createIndex('sessionStart', 'sessionStart', { unique: false });
            store.createIndex('sessionEnd', 'sessionEnd', { unique: false });
            store.createIndex('saleStart', 'saleStart', { unique: false });
            store.createIndex('saleEnd', 'saleEnd', { unique: false });
            store.createIndex('totalSales', 'totalSales', { unique: false });
            store.createIndex('itemsSold', 'itemsSold', { unique: false });
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('dailySalesReportId', 'dailySalesReportId', { unique: false });
            store.createIndex('sessionReportId', 'sessionReportId', { unique: false });
            store.createIndex('itemSalesReportId', 'itemSalesReportId', { unique: false });
            store.createIndex('stockReportId', 'stockReportId', { unique: false });
           
          }
      
          // Create 'Bars' object store if it doesn't exist
          if (!db.objectStoreNames.contains('Bars')) {
            const store = db.createObjectStore('Bars', { keyPath: 'id', autoIncrement: false });
            store.createIndex('uid', 'uid', { unique: true });
            store.createIndex('name', 'name', { unique: false });
            store.createIndex('location', 'location', { unique: false });
            store.createIndex('ownerUid', 'ownerUid', { unique: false });
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('subscriptionExpiration', 'subscriptionExpiration', { unique: false });
            store.createIndex('lastPaymentCode', 'lastPaymentCode', { unique: false });
            store.createIndex('lastPaymentMethod', 'lastPaymentMethod', { unique: false });
            store.createIndex('numberOfTables', 'numberOfTables', { unique: false });
            store.createIndex('totalSales', 'totalSales', { unique: false });
            store.createIndex('totalGap', 'totalGap', { unique: false });
            store.createIndex('subscriptionLevel', 'subscriptionLevel', { unique: false });
          }
      
          // Create 'Users' object store if it doesn't exist
          if (!db.objectStoreNames.contains('Users')) {
            const store = db.createObjectStore('Users', { keyPath: 'uid', autoIncrement: false });
            store.createIndex('displayName', 'displayName', { unique: false });
            store.createIndex('photoURL', 'photoURL', { unique: false });
            store.createIndex('email', 'email', { unique: true });
            store.createIndex('createdAt', 'createdAt', { unique: false });
            store.createIndex('lastLoginAt', 'lastLoginAt', { unique: false });
            store.createIndex('barControled', 'barControled', { unique: false });
            store.createIndex('fullName', 'fullName', { unique: false });
            store.createIndex('phone', 'phone', { unique: false });
            store.createIndex('password', 'password', { unique: false });
            store.createIndex('role', 'role', { unique: false });
            store.createIndex('Subscription', 'Subscription', { unique: false });
          }
      
          // Create 'Stock' object store if it doesn't exist
          if (!db.objectStoreNames.contains('Stock')) {
            const store = db.createObjectStore('Stock', { keyPath: 'id', autoIncrement: true });
            store.createIndex('name', 'name', { unique: false });
            store.createIndex('sizes', 'sizes', { unique: false });
            store.createIndex('barId', 'barId', { unique: false });
          }
      
          // Create 'SalesReports' object store if it doesn't exist
          if (!db.objectStoreNames.contains('SalesReports')) {
            const store = db.createObjectStore('SalesReports', { keyPath: 'id', autoIncrement: true });
            store.createIndex('barId', 'barId', { unique: false });
            store.createIndex('totalSales', 'totalSales', { unique: false });
            store.createIndex('reportDate', 'reportDate', { unique: false });
            store.createIndex('numberOfItemsSold', 'numberOfItemsSold', { unique: false });
          }
      
          // Create 'ItemSalesReport' object store if it doesn't exist
          if (!db.objectStoreNames.contains('ItemSalesReport')) {
            const store = db.createObjectStore('ItemSalesReport', { keyPath: 'id', autoIncrement: true });
            store.createIndex('name', 'name', { unique: false });
            store.createIndex('quantitySold', 'quantitySold', { unique: false });
            store.createIndex('totalSales', 'totalSales', { unique: false });
            store.createIndex('barId', 'barId', { unique: false });
          }
      
          // Create 'BarUserPermissions' object store if it doesn't exist
          if (!db.objectStoreNames.contains('BarUserPermissions')) {
            const store = db.createObjectStore('BarUserPermissions', { keyPath: 'id', autoIncrement: true });
            store.createIndex('barId', 'barId', { unique: false });
            store.createIndex('userId', 'userId', { unique: false });
            store.createIndex('canUpdateSales', 'canUpdateSales', { unique: false });
            store.createIndex('canUpdateStock', 'canUpdateStock', { unique: false });
            store.createIndex('grantedBy', 'grantedBy', { unique: false });
            store.createIndex('grantedAt', 'grantedAt', { unique: false });
            store.createIndex('isMainBar', 'isMainBar', { unique: false });
          }
      
    
    // Create other object stores similarly...

    showNotification("Votre Application a été configurée avec succès", 'Success');
 
}

export function createDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      showNotification("Your browser doesn't support IndexedDB", 'Erreur');
      return reject(new Error("Your browser doesn't support IndexedDB"));
    }

    // Open the database, specifying a version number (e.g., 1)
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(new Error("Erreur creating database"));
    };

    request.onsuccess = (event) => {
      console.info("Database connection established successfully");
      showNotification("Votre Application a été configurée avec succès", 'Success');
      resolve(event.target.result); // Resolve with the database instance
    };

    request.onupgradeneeded = async (event) => {
      try {
        await upgradeDatabase(event);
        showNotification("Votre Application a été configurée avec succès", 'Success');
      } catch (error) {
        console.error("Erreur during database upgrade:", error);
        reject(new Error("Database upgrade failed"));
      }
    };
  });
}

// Function to open and return the database instance
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = async (event) => {
      await upgradeDatabase(event);
  };
    request.onerror = (event) => {
      showNotification("Une erreur est survenue", 'Erreur');
      //console.error("IndexedDB error:", event.target.error);
      reject(new Error("Erreur opening database"));
    };

    request.onsuccess = (event) => {
      resolve(event.target.result); // Resolve with the database instance
    };

    
  });
}





// Function to add data to the object store table and log it in the sync table
export const addToObjectStore = (objectStoreName, data, key) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction(objectStoreName, 'readwrite');
      const store = transaction.objectStore(objectStoreName);
      
      // If the key is null, we need to determine if the store uses auto-incrementing IDs
      if (key === null) {
        // Attempt to add the data without a key, assuming the store allows auto-increment IDs
        console.log("I am here ....", data);
        const addRequest = store.add(data);

        addRequest.onsuccess = () => {
          const indexedDBId = addRequest.result; // Get the inserted ID
          logSyncOperation('add', objectStoreName, indexedDBId, null);
          console.log('Data added and sync operation logged.');
          showNotification("Opération réussie", 'Success');
          resolve(indexedDBId);  // Resolve with the newly inserted ID
        };

        addRequest.onerror = (error) => {
          showNotification(`Error adding data to ${objectStoreName}: ${error.target.error}`, 'Error');
          reject(`Error adding data to ${objectStoreName}: ${error.target.error}`);
        };
      } else {
        // Key is provided, check if it already exists
        const getRequest = store.get(key);

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            // Key already exists, do not add the data
            showNotification(`Key ${key} already exists in ${objectStoreName}.`, 'Warning');
            resolve(null); // Resolve with null or an appropriate message
          } else {
            // Key does not exist, proceed with adding the data
            const addRequest = store.add({ ...data, id: key }); // Specify the key

            addRequest.onsuccess = () => {
              const indexedDBId = addRequest.result; // Get the inserted ID
              logSyncOperation('add', objectStoreName, indexedDBId, null);
              console.log('Data added and sync operation logged.');
              showNotification("Opération réussie", 'Success');
              resolve(indexedDBId);  // Resolve with the newly inserted ID
            };

            addRequest.onerror = (error) => {
              showNotification(`Error adding data to ${objectStoreName}: ${error.target.error}`, 'Error');
              reject(`Error adding data to ${objectStoreName}: ${error.target.error}`);
            };
          }
        };

        getRequest.onerror = (error) => {
          showNotification(`Error checking key ${key} in ${objectStoreName}: ${error.target.error}`, 'Error');
          reject(`Error checking key ${key} in ${objectStoreName}: ${error.target.error}`);
        };
      }
    }).catch(error => {
      reject(`Error opening database: ${error}`);
    });
  });
};

// Function to update data in the object store and log it in the sync table
export const updateObjectStore = (objectStoreName, id, data) => {
  return new Promise((resolve, reject) => {
    // Check if data is defined
    if (!data) {
      reject("Data object is undefined or null");
      return;
    }
    // Ensure the key field (e.g., uid) is present and valid
    if (!data.uid && objectStoreName=="Users" ) {
      reject("Data object is missing a valid 'uid' field.");
      return;
    }
    console.log(data);
    openDB().then((db) => {
      const transaction = db.transaction(objectStoreName, 'readwrite');
      const store = transaction.objectStore(objectStoreName);
      
      // Remove the id from the put operation if it's an in-line key
      const request = store.put(data);  // Update by the key in the data object itself

      request.onsuccess = () => {
        const indexedDBId = request.result;
        // Log the update operation in the sync_table with the id passed separately
        logSyncOperation('update', objectStoreName, indexedDBId, null);
        console.log('Data updated and sync operation logged.');
        
        resolve(id);  // Resolve with the updated ID
      };

      request.onerror = (error) => {
        reject(`Error updating data in ${objectStoreName}: ${error.target.error}`);
      };
    }).catch(error => {
      reject(`Error opening database: ${error}`);
    });
  });
};


// Wrapper function to handle update operation execution
export async function updateObjectStoreExec(objectStoreName, id, data) {
           try {
            const result = await updateObjectStore(objectStoreName, id, data);
            return result;  // Return the result so it can be awaited
          } catch (error) {
            console.error('Error updating data:', error);
            throw error;  // Throw the error to propagate it to the caller
          }
     
  }
 


// Function to delete data from the object store and log it in the sync table
export const deleteFromObjectStore = (objectStoreName, id) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction(objectStoreName, 'readwrite');
      const store = transaction.objectStore(objectStoreName);
      const request = store.delete(id);  // Delete by ID

      request.onsuccess = () => {
        
        // Log the delete operation in the sync_table
        console.log("Before sync log",objectStoreName,id);
        logSyncOperation('delete', objectStoreName, id,null);
        console.log('Data deleted and sync operation logged.');
        
        resolve(id);  // Resolve with the deleted ID
      };

      request.onerror = (error) => {
        reject(`Error deleting data from ${objectStoreName}: ${error.target.error}`);
      };
    }).catch(error => {
      reject(`Error opening database: ${error}`);
    });
  });
};

// Function to get data from the object store
export const getObjectStoreData = (objectStoreName, id) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction(objectStoreName, 'readonly');
      const store = transaction.objectStore(objectStoreName);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);  // Return the retrieved data
        } else {
          reject(`No data found with ID ${id} in ${objectStoreName}`);
        }
      };

      request.onerror = (error) => {
        reject(`Error reading data from ${objectStoreName}: ${error.target.error}`);
      };
    }).catch(error => {
      reject(`Error opening database: ${error}`);
    });
  });
};



//CRUD EXEC
export async function addToObjectStoreExec(objectStoreName, data, key) {
 
    // Validation passed, proceed with saving the data
    try {
      // This block will only run if validation passes:
      const result = await addToObjectStore(objectStoreName, data, key);
      return result;  // Return the result so it can be awaited
    } catch (error) {
      // If there's an error during saving, it is caught here
      console.error("Erreur: ", error.message);
      throw error;  // Throw the error to ensure no further action is taken
    }
  
}

// Function to count entries in the object store
export const getObjectStoreCount = (objectStoreName) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction(objectStoreName, 'readonly');
      const store = transaction.objectStore(objectStoreName);
      const request = store.count();  // Request to count the entries

      request.onsuccess = () => {
        resolve(request.result);  // Return the count of entries
      };

      request.onerror = (error) => {
        reject(`Error counting entries in ${objectStoreName}: ${error.target.error}`);  // Handle any errors
      };
    }).catch(error => {
      reject(`Error opening database: ${error}`);  // Handle database open error
    });
  });
};

export async function getObjectStoreCountExec(objectStoreName) {
 
  // Validation passed, proceed with saving the data
  try {
    // This block will only run if validation passes:
    const result = await getObjectStoreCount(objectStoreName);
    return result;  // Return the result so it can be awaited
  } catch (error) {
    // If there's an error during saving, it is caught here
    console.error("Erreur: ", error.message);
    throw error;  // Throw the error to ensure no further action is taken
  }

}


export async function deleteFromObjectStoreExec(objectStoreName, id) {
  try {
    const result = await deleteFromObjectStore(objectStoreName, id);
    return result;  // Return the result so it can be awaited
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;  // Throw the error to propagate it to the caller
  }
}

export async function getObjectStoreDataExec(objectStoreName, id) {
  try {
    const result = await getObjectStoreData(objectStoreName, id);
    return result;  // Return the result so it can be awaited
  } catch (error) {
    //console.error('Error retrieving data:', error);
    throw error;  // Throw the error to propagate it to the caller
  }
}

export async function getAllObjectStoreDataExec(objectStoreName) {
  try {
    const result = await getAllObjectStoreData(objectStoreName);
    //console.log('All records:', result); 
    return result;  // Return the result so it can be awaited
  } catch (error) {
    //console.error('Error refetching all data:', error);
    throw error;  // Throw the error to propagate it to the caller
  }
}

export async function getWhereFieldEqualsExec(objectStoreName, fieldNames, values) {
  try {
    const result = await getWhereFieldEquals(objectStoreName, fieldNames, values);
    //console.log('All records:', result); 
    return result;  // Return the result so it can be awaited
  } catch (error) {
    //console.error('Error refetching all data:', error);
    throw error;  // Throw the error to propagate it to the caller
  }
}
// Function to get data where specific fields match specific values
export const getWhereFieldEquals = (objectStoreName, fieldNames, values) => {
  return new Promise((resolve) => {
    openDB().then((db) => {
      const transaction = db.transaction(objectStoreName, 'readonly');
      const store = transaction.objectStore(objectStoreName);
      const request = store.openCursor();  // Open a cursor to iterate over all entries

      let results = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const record = cursor.value;
          
          let isMatch = true;

          // Ensure fieldNames and values are treated as arrays
          if (!Array.isArray(fieldNames)) {
            fieldNames = [fieldNames];  // Convert single fieldName to an array
          }
          if (!Array.isArray(values)) {
            values = [values];  // Convert single value to an array
          }

          // If fieldNames and values lengths do not match, log an error
          if (fieldNames.length !== values.length) {
            console.log("Field names and values must have the same length");
            return;
          }

          // Iterate through fieldNames and values to check for matches
          for (let i = 0; i < fieldNames.length; i++) {
            if (record[fieldNames[i]] !== values[i]) {
              isMatch = false; // If any field-value pair doesn't match, break out
              break;
            }
          }

          // If all field-value pairs match, add the record to results
          if (isMatch) {
            results.push(record);
          }

          cursor.continue();  // Move to the next record
        } else {
          // No more entries
          if (results.length > 0) {
            resolve(results);  // Return all matching results
          } else {
            console.log(`No records found where ${fieldNames.join(", ")} = ${values.join(", ")}`);
          }
        }
      };

      request.onerror = (error) => {
        console.log(`Error reading data from ${objectStoreName}: ${error.target.error}`);
      };
    }).catch((error) => {
      console.log(`Error opening database: ${error}`);
    });
  });
};


export async function getAllObjectStoreData(objectStoreName) {
  return new Promise((resolve, reject) => {
    //console.log('Opening database...');
    
    openDB()
      .then((db) => {
        //console.log('Database opened successfully:', db);

        const transaction = db.transaction(objectStoreName, 'readonly');
        const objectStore = transaction.objectStore(objectStoreName);
        const allData = [];

        //console.log('Transaction started on object store:', objectStoreName);

        // Open a cursor to iterate over all records
        const cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
           // console.log('Record found:', cursor.value);
            allData.push(cursor.value);  // Add the current record to the result array
            cursor.continue();  // Move to the next record
          } else {
            //console.log('All records retrieved:', allData);
            resolve(allData);  // Resolve the promise when iteration is done
          }
        };

        cursorRequest.onerror = function (event) {
          //console.error('Error fetching records with cursor:', event.target.errorCode);
          reject(event.target.errorCode);  // Reject the promise in case of an error
        };
      })
      .catch((error) => {
        //console.error('Error opening database:', error);
        reject(error);  // Reject the promise if database can't be opened
      });
  });
}


export const getLastIdAndSet = async (storeName) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);

    // Count the number of records first
    const countRequest = objectStore.count();
    const count = await new Promise((resolve, reject) => {
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = (error) => reject(error);
    });

    if (count === 0) {
      console.log('No records exist, starting with ID = 1');
      return 1;
    }

    // Use cursor to get the last record
    const request = objectStore.openCursor(null, 'prev');

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          console.log(`Found last ID: ${cursor.key}`);
          resolve(cursor.key + 1);
        } else {
          resolve(1);
        }
      };

      request.onerror = (error) => {
        console.error('Error fetching last ID:', error);
        reject(error);
      };
    });
  } catch (error) {
    console.error('Failed to get last ID:', error);
    return 1;
  }
};



// Example usage: Add data to the app_conf table
export const appDefaultConfData = {
  mode: 'developeur',
  mainScreen: 'dashboard',
  status: 'active',
  deviceId: 'device123',
  deviceName: 'Device XYZ',
  os: 'Android',
  manufacturer: 'Google',
  model: 'Pixel 5',
  lastSyncDate: new Date().toISOString()
};


// Example usage: Add data to the sync_table
const syncTableData = {
  tableName: 'users',
  indexedDBId: '12345',
  firestoreId: 'abcde'
};




function clearAllData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(db.objectStoreNames, 'readwrite');

      transaction.oncomplete = function () {
        console.log('All object stores cleared');
        resolve('All data cleared from IndexedDB.');
      };

      transaction.onerror = function (event) {
        console.error('Transaction error:', event.target.error);
        reject(event.target.error);
      };

      // Clear each object store
      Array.from(db.objectStoreNames).forEach((storeName) => {
        const objectStore = transaction.objectStore(storeName);
        objectStore.clear();
      });
    };

    request.onerror = function (event) {
      console.error('Error opening database:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}

export async function clearAllDataExec() {
  try {
    const result = await clearAllData();
    console.log(result);
    return result;  // Return the result so it can be awaited
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error; // Throw the error to propagate it to the caller
  }
}


function removeDatabase() {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

    deleteRequest.onsuccess = function () {
      console.log(`Database "${DB_NAME}" successfully deleted.`);
      resolve(`Database "${DB_NAME}" successfully deleted.`);
    };

    deleteRequest.onerror = function (event) {
      console.error('Error deleting database:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    deleteRequest.onblocked = function () {
      console.warn('Database deletion is blocked. Please close all other tabs using this database.');
      reject('Database deletion is blocked.');
    };
  });
}

export async function removeDatabaseExec() {
  try {
    const result = await removeDatabase();
    console.log(result);
    return result;  // Return the result so it can be awaited
  } catch (error) {
    console.error('Error removing database:', error);
    throw error;  // Throw the error to propagate it to the caller
  }
}

//DB cost functions
export const handleClearData = () => {
  clearAllDataExec()
    .then(() => console.log('All data cleared successfully!'))
    .catch(error => console.error('Error clearing data:', error));
};

export  const handleRemoveDatabase = () => {
  removeDatabaseExec()
    .then(() => console.log('Database removed successfully!'))
    .catch(error => console.error('Error removing database:', error));
};
export const handleAddToDatastoreObject = (objectStoreName, data, key) => {
  addToObjectStoreExec(objectStoreName, data, key)
    .then(() => console.log('Data added successfully!'))
    .catch(error => console.error('Error adding to datastore:', error));
};


// Function to set one or more fields to specific values in records matching a condition
export const setFieldValues = (objectStoreName, fieldName, fieldValue, updates) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction(objectStoreName, 'readwrite');
      const store = transaction.objectStore(objectStoreName);
      const request = store.openCursor();  // Open a cursor to iterate over records

      let updatedCount = 0;  // Keep track of how many records were updated

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const record = cursor.value;
          // Check if the specified field matches the condition value
          if (record[fieldName] === fieldValue) {
            // Update the specified fields in the record
            Object.keys(updates).forEach((key) => {
              record[key] = updates[key];
            });

            // Update the record in the database
            const updateRequest = cursor.update(record);

            updateRequest.onsuccess = () => {
              updatedCount++;  // Increment count of updated records
            };

            updateRequest.onerror = (error) => {
              reject(`Error updating record: ${error.target.error}`);
            };
          }
          cursor.continue();  // Move to the next record
        } else {
          // No more entries
          if (updatedCount > 0) {
            resolve(`${updatedCount} record(s) updated successfully`);
          } else {
            return null;
          }
        }
      };

      request.onerror = (error) => {
        console.log(`Error reading data from ${objectStoreName}: ${error.target.error}`);
      };
    }).catch((error) => {
      console.log(`Error opening database: ${error}`);
    });
  });
};


