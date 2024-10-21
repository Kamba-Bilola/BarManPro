const DB_NAME = 'BarManagementDB';
const DB_VERSION = 2;
let db;



// Single function to handle opening the database and upgrading if necessary
export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      db = event.target.result;

      // Create object stores (tables) if they don't exist
      if (!db.objectStoreNames.contains('bars')) {
        const barsStore = db.createObjectStore('bars', { keyPath: 'id', autoIncrement: true });
        barsStore.createIndex('ownerPhone', 'ownerPhone', { unique: false });
      }

      if (!db.objectStoreNames.contains('users')) {
        const usersStore = db.createObjectStore('users', { keyPath: 'uid', autoIncrement: true });
        usersStore.createIndex('telephone', 'telephone', { unique: false });
        usersStore.createIndex('email', 'email', { unique: true });
        usersStore.createIndex('expirationTime', 'expirationTime', { unique: false }); // Add expirationTime index
      }

      if (!db.objectStoreNames.contains('stocks')) {
        db.createObjectStore('stocks', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('salesReports')) {
        db.createObjectStore('salesReports', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('itemSalesReport')) {
        db.createObjectStore('itemSalesReport', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('stock')) {
        db.createObjectStore('stock', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Function to get all data from an object store
export const getAllData = (storeName) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  });
};

// Function to add data to an object store
export const addItem = (storeName, data) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  });
};

// Function to update an item in an object store
export const updateItem = (storeName, data) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  });
};

// Function to delete an item from an object store
export const deleteItem = (storeName, key) => {
  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  });
};

//Fake content Mangement functions
function clearData(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.clear();
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(false);
  });
}

async function populateMockData() {
 try {
    await openDB();
    console.log('Populating mock data...');
    
    await addItem('bars', InitBars);
    await addItem('reports', InitReport);
    await addItem('itemSalesReport', InitItemSalesReport);
    await addItem('stock', InitStock);
    await addItem('users', InitUsers);

    console.log('Data successfully inserted');
  } catch (e) {
    console.error('Error populating mock data:', e);
  }
}

async function clearAllData() {
  await openDB();
  await clearData('bars');
  await clearData('reports');
  await clearData('itemSalesReport');
  await clearData('stock');
  await clearData('users');

  console.log('Données effacées avec succès');
}