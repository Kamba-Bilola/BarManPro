import { DB_NAME,DB_VERSION,openDB } from "./IndexedDB";
import { logSyncOperation } from "./sync";


// Function to add data to the object store table and log it in the sync table
export const addToObjectStore = (objectStoreName, data, key) => {
    return new Promise((resolve, reject) => {
      openDB().then((db) => {
        const transaction = db.transaction(objectStoreName, 'readwrite');
        const store = transaction.objectStore(objectStoreName);
        
        // If the key is null, we need to determine if the store uses auto-incrementing IDs
        if (key === null) {
          // Attempt to add the data without a key, assuming the store allows auto-increment IDs
          const addRequest = store.add(data);
  
          addRequest.onsuccess = () => {
            const indexedDBId = addRequest.result; // Get the inserted ID
            logSyncOperation('add', objectStoreName, indexedDBId, null);
            resolve(indexedDBId);  // Resolve with the newly inserted ID
          };
  
          addRequest.onerror = (error) => {
            reject(`Error adding data to ${objectStoreName}: ${error.target.error}`);
          };
        } else {
          // Key is provided, check if it already exists
          const getRequest = store.get(key);
  
          getRequest.onsuccess = () => {
            if (getRequest.result) {
              // Key already exists, do not add the data
              resolve(null); // Resolve with null or an appropriate message
            } else {
              // Key does not exist, proceed with adding the data
              const addRequest = store.add({ ...data, id: key }); // Specify the key
  
              addRequest.onsuccess = () => {
                const indexedDBId = addRequest.result; // Get the inserted ID
                logSyncOperation('add', objectStoreName, indexedDBId, null);
                resolve(indexedDBId);  // Resolve with the newly inserted ID
              };
  
              addRequest.onerror = (error) => {
                reject(`Error adding data to ${objectStoreName}: ${error.target.error}`);
              };
            }
          };
  
          getRequest.onerror = (error) => {
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
      openDB().then((db) => {
        const transaction = db.transaction(objectStoreName, 'readwrite');
        const store = transaction.objectStore(objectStoreName);
        // Remove the id from the put operation if it's an in-line key
        const request = store.put(data);  // Update by the key in the data object itself
  
        request.onsuccess = () => {
          const indexedDBId = request.result;
          // Log the update operation in the sync_table with the id passed separately
          logSyncOperation('update', objectStoreName, indexedDBId, null);
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
          logSyncOperation('delete', objectStoreName, id,null);          
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

          // Ensure fieldNames and values are treated as arrays, even if passed as single values
          fieldNames = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
          values = Array.isArray(values) ? values : [values];

          // Check if fieldNames and values arrays have the same length
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
            //console.log(`No records found where ${fieldNames.join(", ")} = ${values.join(", ")}`);
            resolve([]); // Return an empty array if no matches are found
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
    console.log("setFieldValues : ",objectStoreName, fieldName, fieldValue, updates);
    if(objectStoreName && fieldName && fieldValue && updates){
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
    });}else{ console.log(`Error from parametters`);}
  };
  
  
  
  