const DB_NAME = 'BarManagementDB';
const DB_VERSION = 3;
let db;


export // Open IndexedDB and create tables based on the provided structures
function openDB() {
  
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Define the schema for AppConfig table
    if (!db.objectStoreNames.contains('AppConfig')) {
      const appConfigStore = db.createObjectStore('AppConfig', { keyPath: 'id' });
      appConfigStore.createIndex('appId', 'appId', { unique: false });
      // Define additional indexes and nested object structure as needed
    }

    // Define the schema for GapReports table
    if (!db.objectStoreNames.contains('GapReports')) {
      const gapReportsStore = db.createObjectStore('GapReports', { keyPath: 'id' });
      gapReportsStore.createIndex('barId', 'barId', { unique: false });
      gapReportsStore.createIndex('userId', 'userId', { unique: false });
    }

    // Define the schema for StoreChecks table
    if (!db.objectStoreNames.contains('StoreChecks')) {
      const storeChecksStore = db.createObjectStore('StoreChecks', { keyPath: 'id' });
      storeChecksStore.createIndex('barId', 'barId', { unique: false });
      storeChecksStore.createIndex('userId', 'userId', { unique: false });
    }

    // Define the schema for Documents table
    if (!db.objectStoreNames.contains('Documents')) {
      const documentsStore = db.createObjectStore('Documents', { keyPath: 'id' });
      documentsStore.createIndex('userId', 'userId', { unique: false });
      documentsStore.createIndex('barId', 'barId', { unique: false });
    }

    // Define the schema for Sessions table
    if (!db.objectStoreNames.contains('Sessions')) {
      const sessionsStore = db.createObjectStore('Sessions', { keyPath: 'id' });
      sessionsStore.createIndex('barId', 'barId', { unique: false });
      sessionsStore.createIndex('userId', 'userId', { unique: false });
      sessionsStore.createIndex('dailySalesReportId', 'dailySalesReportId', { unique: false });
      sessionsStore.createIndex('sessionReportId', 'sessionReportId', { unique: false });
      sessionsStore.createIndex('itemSalesReportId', 'itemSalesReportId', { unique: false });
      sessionsStore.createIndex('stockReportId', 'stockReportId', { unique: false });
    }

    // Define the schema for Bars table
    if (!db.objectStoreNames.contains('Bars')) {
      const barsStore = db.createObjectStore('Bars', { keyPath: 'id' });
      barsStore.createIndex('ownerUid', 'ownerUid', { unique: false });
    }

    // Define the schema for Users table
    if (!db.objectStoreNames.contains('Users')) {
      const usersStore = db.createObjectStore('Users', { keyPath: 'uid' });
      usersStore.createIndex('email', 'email', { unique: true });
      usersStore.createIndex('createdAt', 'createdAt', { unique: false });
      usersStore.createIndex('lastLoginAt', 'lastLoginAt', { unique: false });
    }

    // Define the schema for Stocks table
    if (!db.objectStoreNames.contains('Stocks')) {
      const stocksStore = db.createObjectStore('Stocks', { keyPath: 'id' });
    }

    // Define the schema for SalesReports table
    if (!db.objectStoreNames.contains('SalesReports')) {
      const salesReportsStore = db.createObjectStore('SalesReports', { keyPath: 'id', autoIncrement: true });
      salesReportsStore.createIndex('barId', 'barId', { unique: false });
      salesReportsStore.createIndex('reportDate', 'reportDate', { unique: false });
    }

    // Define the schema for ItemSalesReport table
    if (!db.objectStoreNames.contains('ItemSalesReport')) {
      const itemSalesReportStore = db.createObjectStore('ItemSalesReport', { keyPath: 'id' });
    }

    // Define the schema for BarUserPermissions table
    if (!db.objectStoreNames.contains('BarUserPermissions')) {
      const barUserPermissionsStore = db.createObjectStore('BarUserPermissions', { keyPath: 'id' });
      barUserPermissionsStore.createIndex('barId', 'barId', { unique: false });
      barUserPermissionsStore.createIndex('userId', 'userId', { unique: false });
      barUserPermissionsStore.createIndex('grantedBy', 'grantedBy', { unique: false });
    }

    // Define the schema for SyncMap table
    if (!db.objectStoreNames.contains('SyncMap')) {
      const syncMapStore = db.createObjectStore('SyncMap', { keyPath: 'indexedDBId' });
      syncMapStore.createIndex('tableName', 'tableName', { unique: false });
      syncMapStore.createIndex('indexedDBId', 'indexedDBId', { unique: true });
      syncMapStore.createIndex('firestoreId', 'firestoreId', { unique: true });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    console.log('Database opened successfully');
    // You can now perform CRUD operations here
  };

  request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
  };
}




// Function to delete the IndexedDB and rebuild it
function resetDatabase() {
  
  // Delete the existing database
  const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

  deleteRequest.onsuccess = () => {
    console.log('Database deleted successfully');
    // Rebuild the database after deletion
    openDB();
  };

  deleteRequest.onerror = (event) => {
    console.error('Error deleting database:', event.target.errorCode);
  };

  deleteRequest.onblocked = () => {
    console.log('Database deletion blocked');
  };
}

// Call the resetDatabase function to delete and rebuild the database
resetDatabase();

