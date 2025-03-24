export const DB_NAME = 'BAR_MAN_PRO_DB';
export const DB_VERSION = 1;
export let db;


          // DONT DELETE: Migration function for version 4
         /* async function migrateToVersion4(db, oldVersion, transaction) {
            console.log(db, oldVersion, transaction);
            if (db.objectStoreNames.contains('Documents')) {
              // Use the upgrade transaction to get the old data
              const store = transaction.objectStore('Documents');
              const oldData = await new Promise((resolve, reject) => {
                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = (e) => resolve(e.target.result);
                getAllRequest.onerror = (e) =>
                  reject(new Error("Failed to read old Documents data"));
              });
          
              // Delete and recreate the Documents store using the current upgrade transaction
              transaction.db.deleteObjectStore('Documents');
              const newDocStore = transaction.db.createObjectStore('Documents', {
                keyPath: 'id',
                autoIncrement: true
              });
              newDocStore.createIndex('userId', 'userId', { unique: false });
              newDocStore.createIndex('fileName', 'fileName', { unique: false });
              newDocStore.createIndex('filePath', 'filePath', { unique: false });
              newDocStore.createIndex('fileType', 'fileType', { unique: false });
              newDocStore.createIndex('reportType', 'reportType', { unique: false });
              newDocStore.createIndex('reportId', 'reportIds', { unique: false });
              newDocStore.createIndex('barId', 'barId', { unique: false });
              newDocStore.createIndex('createdAt', 'createdAt', { unique: false });
              newDocStore.createIndex('shared', 'shared', { unique: false });
              newDocStore.createIndex('sharedWith', 'sharedWith', { unique: false });
          
              // Reinsert the old data into the new store
              oldData.forEach((record) => {
                newDocStore.put(record);
              });
              console.log("✅ Documents store migrated to version 4");
            }
          }*/
          
      
   
    async function migrateDatabase(db, oldVersion, transaction) {
      // Always wrap migration in a transaction
      transaction.oncomplete = () => console.log("Database upgrade completed");
      transaction.onerror = (event) => {
        console.error("Migration error:", event.target.error);
        throw new Error("Migration failed: " + event.target.error);
      };
     
      // Incremental migration based on oldVersion
      if (oldVersion < 1) {
        // Initial database creation
        createInitialSchema(db);
      }
    
      /*if (oldVersion < 2) {
        // Version 2 migrations
        migrateToVersion2(db);
      }*/
    
     
    } 

  


    function createInitialSchema(db) {
      // Setup database schema if it does not exist
      
    
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
                store.createIndex('notes', 'notes', { unique: false });
              }
    
              // Create 'ItemSalesReport' object store if it doesn't exist
              if (!db.objectStoreNames.contains('ItemReport')) {
                const store = db.createObjectStore('ItemReport', { keyPath: 'id', autoIncrement: true });
                store.createIndex('ref', 'ref', { unique: false });
                store.createIndex('refId', 'refId', { unique: false });
                store.createIndex('productId', 'productId', { unique: false });
                store.createIndex('variationId', 'variationId', { unique: false });
                store.createIndex('quantity', 'quantity', { unique: false });
                store.createIndex('priceValue', 'priceValue', { unique: false });
                store.createIndex('barId', 'barId', { unique: false });
                
              }
          
              // Create 'Documents' object store if it doesn't exist              
              if (!db.objectStoreNames.contains('Documents')) {
              const newDocStore = db.createObjectStore('Documents', {
                  keyPath: 'id',
                  autoIncrement: true
                });
              newDocStore.createIndex('userId', 'userId', { unique: false });
              newDocStore.createIndex('fileName', 'fileName', { unique: false });
              newDocStore.createIndex('filePath', 'filePath', { unique: false });
              newDocStore.createIndex('fileType', 'fileType', { unique: false });
              newDocStore.createIndex('reportType', 'reportType', { unique: false });
              newDocStore.createIndex('reportId', 'reportIds', { unique: false });
              newDocStore.createIndex('barId', 'barId', { unique: false });
              newDocStore.createIndex('createdAt', 'createdAt', { unique: false });
              newDocStore.createIndex('shared', 'shared', { unique: false });
              newDocStore.createIndex('sharedWith', 'sharedWith', { unique: false });}
          
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
                const store = db.createObjectStore('Bars', { keyPath: 'id', autoIncrement: true });
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
          
              // Create 'Products' object store if it doesn't exist
              if (!db.objectStoreNames.contains('Products')) {
                const productStore = db.createObjectStore('Products', { keyPath: 'id', autoIncrement: true });
                productStore.createIndex('name', 'name', { unique: true });
                productStore.createIndex('category', 'category', { unique: false });
                productStore.createIndex('barId', 'barId', { unique: false });
              }
    
              // Create 'Variations' object store if it doesn't exist
              if (!db.objectStoreNames.contains('Variations')) {
                const variationStore = db.createObjectStore('Variations', { keyPath: 'id', autoIncrement: true });
                variationStore.createIndex('productId', 'productId', { unique: false }); // Link to Products
                variationStore.createIndex('capacity', 'capacity', { unique: false }); // JSON attributes field
                variationStore.createIndex('packaging', 'packaging', { unique: false });
                variationStore.createIndex('flavor', 'flavor', { unique: false });
                variationStore.createIndex('price', 'price', { unique: false });
                variationStore.createIndex('imageUrl', 'imageUrl', { unique: false });
                variationStore.createIndex('isDefault', 'isDefault', { unique: false });
              }
    
          
              // Create 'SalesReports' object store if it doesn't exist
              if (!db.objectStoreNames.contains('SalesReports')) {
                const store = db.createObjectStore('SalesReports', { keyPath: 'id', autoIncrement: true });
                store.createIndex('barId', 'barId', { unique: false });
                store.createIndex('totalSales', 'totalSales', { unique: false });
                store.createIndex('reportDate', 'reportDate', { unique: false });
                store.createIndex('numberOfItemsSold', 'numberOfItemsSold', { unique: false });
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
    
       
    }
    
       
// Function to check if the database exists
export const checkIfDatabaseExists = () => {
  
return new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onsuccess = function(event) { const db = event.target.result;
    db.close(); resolve(true); };

  request.onupgradeneeded = function(event) {
    event.target.transaction.abort(); resolve(false); };

  request.onerror = function(event) { resolve(false);};

  request.onblocked = function(event) {
    reject(new Error("Database check blocked."));
  };

  request.onabort = function(event) {
    reject(new Error("Transaction aborted."));
  };

  // Adding a timeout as a safety measure
  setTimeout(() => {
    reject(new Error("Database check timed out."));
  }, 15000); // 5-second timeout for the request
});
};

export function createDatabase() {
return new Promise((resolve, reject) => {
  if (!window.indexedDB) {
    return reject(new Error("Erreur Code 2: Votre navigateur ne support pas notre système de base de donné"));
  }

  // Open the database, specifying a version number (e.g., 1)
  const request = window.indexedDB.open(DB_NAME, DB_VERSION);

  request.onerror = (event) => {
    reject(new Error("Erreur creating database"));
  };

  request.onsuccess = (event) => {
    resolve(event.target.result); // Resolve with the database instance
  };

    request.onblocked = () => {
          console.warn("Database upgrade blocked. Close other tabs/windows using the database.");
          // Implement retry logic or user notification here
          reject(new Error("DATABASE_BLOCKED"));
        };
    
        request.onupgradeneeded = async (event) => {
          const db = event.target.result;
          const oldVersion = event.oldVersion;
          const transaction = event.target.transaction;
           // Handle database version upgrades incrementally
          migrateDatabase(db, oldVersion, transaction);
          try {
            await upgradeDatabase(event);
          } catch (error) {
            reject(new Error("Problème de mise à jour de la base de données"));
          }
        };
      });
    }
    async function upgradeDatabase(event) {}
    // Function to open and return the database instance
  export function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        migrateDatabase(event.target.result, event.oldVersion, event.target.transaction);
      };
  
      request.onblocked = () => {
        reject(new Error("DATABASE_BLOCKED"));
      };
      request.onerror = (event) => {
        reject(new Error("Database open error: " + event.target.error));
      };
  
      request.onsuccess = (event) => {
        db = event.target.result;
        
        // Verify schema version
        if (db.version !== DB_VERSION) {
          db.close();
          createDatabase().then(resolve).catch(reject);
        } else {
          resolve(db);
        }
      };
  
      
    });
  }
  

  
  