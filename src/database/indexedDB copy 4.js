import {
  AppConfigStructure,GapReportsStructure,StoreChecksStructure,DocumentsStructure,SessionsStructure,BarsStructure,UsersStructure,StockStructure,ItemSalesReportStructure,BarUserPermissionsStructure,SyncMapStructure} from './structure_v2'; // Adjust the import path as necessary
import { fakeData } from './fakeData';
const structures = {
  AppConfig: AppConfigStructure,
  GapReports: GapReportsStructure,
  StoreChecks: StoreChecksStructure,
  Documents: DocumentsStructure,
  Sessions: SessionsStructure,
  Bars: BarsStructure,
  Users: UsersStructure,
  Stocks: StockStructure,
  ItemSalesReport: ItemSalesReportStructure,
  BarUserPermissions: BarUserPermissionsStructure,
  SyncMap: SyncMapStructure
};

const DB_NAME = 'BarManagementDB';
const DB_VERSION = 2.2;
let db;


export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      
      Object.keys(structures).forEach(tableName => {
        const tableStructure = structures[tableName];
        if (!db.objectStoreNames.contains(tableName)) {
          const objectStore = db.createObjectStore(tableName, {
            keyPath: tableStructure.keyPath,
            autoIncrement: tableStructure.autoIncrement
          });

          tableStructure.fields.forEach(field => {
            if (field.indexed) {
              objectStore.createIndex(field.name, field.name, { unique: false });
            }
            if (field.fields) {
              // Handle nested object stores
              // This is a simplified example; more complex structures may require additional handling
              field.fields.forEach(subField => {
                if (subField.indexed) {
                  objectStore.createIndex(`${field.name}_${subField.name}`, `${field.name}.${subField.name}`, { unique: false });
                }
              });
            }
          });
        }
      });
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}


// Function to get all data from an object store
export const getAllData = (storeName) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => { // Adjust dbName and dbVersion as needed
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(`Error retrieving data from ${storeName}: ${request.error}`);
      };
    }).catch(error => {
      reject(`Error opening database: ${error}`);
    });
  });
};





// Function to add data to an object store with duplicate check
export const addItem = (storeName, data, structure) => {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const keyPath = store.keyPath;

        // Helper function to handle adding an item with duplicate check
        const addItemToStore = (item) => {
          const itemKey = item[keyPath];
          const getRequest = store.get(itemKey);
  
          return new Promise((resolve, reject) => {
            getRequest.onsuccess = () => {
              if (!getRequest.result) {
                const addRequest = store.add(item);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = () => reject(`Error adding item to ${storeName}: ${addRequest.error}`);
              } else {
                reject(`Item already exists in ${storeName} with key: ${itemKey}`);
              }
            };
            getRequest.onerror = () => reject(`Error checking for existing item in ${storeName}: ${getRequest.error}`);
          });
        };



        // Handle data and ensure transaction completion
const handleData = (data) => {
  let promises = [];

  if (Array.isArray(data)) {
    data.forEach(item => {
      promises.push(validateForeignKeys(item,structure)
        .then(() => addItemToStore(item))
        .catch(error => Promise.reject(error)));
    });
  } else {
    promises.push(validateForeignKeys(data,structure)
      .then(() => addItemToStore(data))
      .catch(error => Promise.reject(error)));
  }

  // Wait for all promises to resolve or reject
  Promise.all(promises)
    .then(() => {
      transaction.oncomplete = () => {
        resolve(`All items processed for ${storeName}`);
      };
    })
    .catch((error) => {
      reject(error);
    });
};


        handleData(data);
      })
      .catch(error => {
        reject(`Error opening database: ${error}`);
      });
  });
};




const validateForeignKeys = (item , structure) => {
  const foreignKeyChecks = [];

  structure.fields.forEach((field) => {
    if (field.keyType === 'foreign') {
      const referenceTable = field.reference.table;
      const referenceField = field.reference.field;
      const foreignKeyValue = item[field.name];

      const foreignTransaction = db.transaction([referenceTable], 'readonly');
      const foreignStore = foreignTransaction.objectStore(referenceTable);
      const foreignRequest = foreignStore.get(foreignKeyValue);

      const foreignKeyCheck = new Promise((resolveForeign, rejectForeign) => {
        foreignRequest.onsuccess = () => {
          if (foreignRequest.result && foreignRequest.result[referenceField] === foreignKeyValue) {
            resolveForeign();
          } else {
            rejectForeign(`Foreign key ${foreignKeyValue} not found in ${referenceTable}`);
          }
        };
        foreignRequest.onerror = () => rejectForeign(`Error checking foreign key in ${referenceTable}: ${foreignRequest.error}`);
      });

      foreignKeyChecks.push(foreignKeyCheck);
    }
  });

  return Promise.all(foreignKeyChecks);
};



/*export const addItem = (storeName, data, structure) => {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const keyPath = store.keyPath;

        // Helper function to validate foreign keys
        const validateForeignKeys = (item) => {
          const foreignKeyChecks = [];

          structure.fields.forEach((field) => {
            if (field.keyType === 'foreign') {
              const referenceTable = field.reference.table;
              const referenceField = field.reference.field;
              const foreignKeyValue = item[field.name];

              const foreignTransaction = db.transaction([referenceTable], 'readonly');
              const foreignStore = foreignTransaction.objectStore(referenceTable);
              const foreignRequest = foreignStore.get(foreignKeyValue);

              const foreignKeyCheck = new Promise((resolveForeign, rejectForeign) => {
                foreignRequest.onsuccess = () => {
                  if (foreignRequest.result && foreignRequest.result[referenceField] === foreignKeyValue) {
                    resolveForeign(); // Foreign key is valid
                  } else {
                    rejectForeign(`Foreign key ${foreignKeyValue} not found in ${referenceTable}`);
                  }
                };
                foreignRequest.onerror = () => {
                  rejectForeign(`Error checking foreign key in ${referenceTable}: ${foreignRequest.error}`);
                };
              });

              foreignKeyChecks.push(foreignKeyCheck);
            }
          });

          return Promise.all(foreignKeyChecks);
        };

        // Helper function to handle adding an item with duplicate check
        const addItemToStore = (item) => {
          const itemKey = item[keyPath];
          const getRequest = store.get(itemKey);

          return new Promise((resolve, reject) => {
            getRequest.onsuccess = () => {
              if (!getRequest.result) {
                validateForeignKeys(item)
                  .then(() => {
                    const addRequest = store.add(item);
                    addRequest.onsuccess = () => {
                      resolve(); // Successfully added item
                    };
                    addRequest.onerror = () => {
                      reject(`Error adding item to ${storeName}: ${addRequest.error}`);
                    };
                  })
                  .catch((error) => {
                    reject(`Foreign key validation failed: ${error}`);
                  });
              } else {
                reject(`Item already exists in ${storeName} with key: ${itemKey}`);
              }
            };

            getRequest.onerror = () => {
              reject(`Error checking for existing item in ${storeName}: ${getRequest.error}`);
            };
          });
        };

        // Handle data and ensure transaction completion
        const handleData = (data) => {
          let promises = [];

          if (Array.isArray(data)) {
            data.forEach(item => {
              promises.push(addItemToStore(item));
            });
          } else {
            promises.push(addItemToStore(data));
          }

          // Wait for all promises to resolve or reject
          Promise.all(promises)
            .then(() => {
              transaction.oncomplete = () => {
                resolve(`All items processed for ${storeName}`);
              };
            })
            .catch((error) => {
              reject(error);
            });
        };

        handleData(data);
      })
      .catch(error => {
        reject(`Error opening database: ${error}`);
      });
  });
};
*/








// Function to update an item in an object store
export const updateItem = (storeName, data) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => { // Adjust dbName and dbVersion as needed
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(`Error updating data in ${storeName}: ${request.error}`);
      };
    }).catch(error => {
      reject(`Error opening database: ${error}`);
    });
  });
};

// Function to delete an item from an object store
export const deleteItem = (storeName, key) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => { // Adjust dbName and dbVersion as needed
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(`Error deleting data from ${storeName}: ${request.error}`);
      };
    }).catch(error => {
      reject(`Error opening database: ${error}`);
    });
  });
};



//Fake content Mangement functions
// Function to clear data from an object store
function clearData(storeName) {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {

      // Check if the object store exists
      if (!db.objectStoreNames.contains(storeName)) {
        return reject(`Object store ${storeName} does not exist`);
      }
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(`Failed to clear ${storeName}: ${request.error}`);
    }).catch(error => reject(`Error opening database: ${error}`));
  });
}


// Function to populate mock data into the database
async function populateMockData() {
  try {
    await openDB(); // Ensure the database is open
    //console.log('Populating mock data...');
    checkAndAdd ('Users', fakeData.Users, UsersStructure);
    checkAndAdd ('Bars', fakeData.Bars, BarsStructure);
    //await addItem('Bars', fakeData.Bars);
    //await addItem('Reports', fakeData.Report);
    //await addItem('ItemSalesReport', fakeData.ItemSalesReport);
    //await addItem('Stock', fakeData.InitStock);
    // Iterate through each item in Users and log to confirm correct structure
    
    
    
    
    //await addItem('Sessions', fakeData.Sessions);
    //await addItem('BarUserPermissions', fakeData.BarUserPermissions);
    //await addItem('SyncMap', fakeData.SyncMap);
    //await addItem('AppConfig', fakeData.AppConfig);
    //await addItem('GapReports', fakeData.GapReports);
    //await addItem('StoreChecks', fakeData.StoreChecks);
    //await addItem('Documents', fakeData.Documents);
    //await addItem('Report', fakeData.InitReport); // Assuming `report` table is used

    //console.log('Data successfully inserted');
  } catch (e) {
    console.error('Error populating mock data:', e);
  }
}

// Function to clear all data from all object stores
async function clearAllData() {
  try {
    const db = await openDB(); // Ensure the database is open
    await Promise.all([
      clearData('bars'),
      clearData('reports'),
      clearData('itemSalesReport'),
      clearData('stock'),
      clearData('users'),
      clearData('sessions'),
      clearData('barUserPermissions'),
      clearData('syncMap'),
      clearData('appConfig'),
      clearData('gapReports'),
      clearData('storeChecks'),
      clearData('documents'),
      clearData('salesReports'),
      clearData('report') // Assuming `report` table is used
    ]);

    //console.log('All data cleared successfully');
  } catch (e) {
    console.error('Error clearing all data:', e);
  }
}





// Function to close all open connections before deletion
function closeDatabaseConnections(db) {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close();
      resolve();
    } else {
      reject('No database connection to close.');
    }
  });
}

function deleteDatabase(DB_NAME) {
  return new Promise((resolve, reject) => {
    // Attempt to open the database to close it
    const openRequest = indexedDB.open(DB_NAME);

    openRequest.onsuccess = async (event) => {
      const db = event.target.result;

      // Close the open database connection
      await closeDatabaseConnections(db);

      // Proceed with deletion after closing connections
      const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

      deleteRequest.onsuccess = () => {
        console.log(`Database ${DB_NAME} deleted successfully`);
        resolve(true);
      };

      deleteRequest.onerror = (event) => {
        console.error(`Failed to delete database ${DB_NAME}: ${event.target.error}`);
        reject(event.target.error);
      };

      deleteRequest.onblocked = () => {
        console.warn(`Deletion of database ${DB_NAME} is blocked due to open connections`);
        reject('Database deletion blocked');
      };
    };

    openRequest.onerror = (event) => {
      console.error(`Error opening database for deletion: ${event.target.error}`);
      reject(event.target.error);
    };
  });
}






  // General function to validate keyPath before adding item
export const validateKeyPath = (storeName, data, structure) => {
  //console.log("validating... keyPath before adding item"); 
  return new Promise((resolve, reject) => {
    // Loop through the data (array or single item) and check for the keyPath
    const items = Array.isArray(data) ? data : [data];
    const missingKeyPathItems = [];

    // Retrieve the keyPath from the structure
    const keyPath = structure.keyPath;

    items.forEach((item) => {
      //console.log(`Checking item for ${storeName}:`, item);

      // Check if the keyPath is present in the item
      if (!item[keyPath]) {
        console.error(`Item missing ${keyPath}:`, item);
        missingKeyPathItems.push(item); // Collect items that are missing the keyPath
      }
    });

    // If all items are valid, resolve; otherwise, reject with missing keyPath info
    if (missingKeyPathItems.length === 0) {
      resolve('All items are valid.');
    } else {
      reject(`Some items are missing the keyPath (${keyPath}): ${JSON.stringify(missingKeyPathItems)}`);
    }
  });
};



export const checkAndAdd = async (storeName, data, structure) => {
  try {
    // Perform validation if needed
    console.log('Checking and adding item...');
    await addItem(storeName,  data, structure).then((result) => console.log(result))
    .catch((error) => console.error(error));
    console.log('Checking and adding item...');
  // Validate keyPath before adding items to the store
validateKeyPath(storeName,  data, structure)
  } catch (error) {
    console.error('Error in checkAndAdd:', error);
  }
};




//clearAllData();
//deleteDatabase('BarManagementDB').then(() => console.log('Database deletion complete')).catch((error) => console.error('Error deleting database:', error));
populateMockData();