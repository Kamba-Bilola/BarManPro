//database/syncFromFirestore.js
 
//Import necessary Firebase and IndexedDB functions
import { myFirestoreDb } from './firebase';
import { getDocs, collection } from 'firebase/firestore';
import { openDB } from './indexedDB';

// Function to compare and sync Firestore and IndexedDB data
async function syncDataWithFirestore() {
  try {
    // Open IndexedDB
    const db = await openDB();

    // Fetch data from Firestore (e.g., 'Bars', 'Users', 'Stock' collections)
    const barsFromFirestore = await fetchFirestoreCollection('Bars');
    const usersFromFirestore = await fetchFirestoreCollection('Users');
    const stockFromFirestore = await fetchFirestoreCollection('Stock');

    // Fetch data from IndexedDB
    const barsFromIndexedDB = await fetchIndexedDBData(db, 'Bars');
    const usersFromIndexedDB = await fetchIndexedDBData(db, 'Users');
    const stockFromIndexedDB = await fetchIndexedDBData(db, 'Stock');

    // Compare and update IndexedDB with Firestore data
    await compareAndUpdate(db, 'Bars', barsFromIndexedDB, barsFromFirestore);
    await compareAndUpdate(db, 'Users', usersFromIndexedDB, usersFromFirestore);
    await compareAndUpdate(db, 'Stock', stockFromIndexedDB, stockFromFirestore);

    // Update sync_table in IndexedDB
    await updateSyncTable(db);
  } catch (error) {
    console.error('Error syncing data:', error);
  }
}

// Function to fetch a collection from Firestore
async function fetchFirestoreCollection(collectionName) {
  const collectionRef = collection(myFirestoreDb, collectionName);
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Function to fetch data from IndexedDB
async function fetchIndexedDBData(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Function to compare Firestore and IndexedDB data and update IndexedDB
async function compareAndUpdate(db, storeName, localData, remoteData) {
  const store = db.transaction(storeName, 'readwrite').objectStore(storeName);

  // Map Firestore data by ID for easy lookup
  const remoteDataMap = new Map(remoteData.map(item => [item.id, item]));

  // Update missing data in IndexedDB
  for (let localItem of localData) {
    if (!remoteDataMap.has(localItem.id)) {
      console.log(`Updating missing data for ${localItem.id} in ${storeName}`);
      store.put(localItem);
    }
  }

  // Insert new items from Firestore into IndexedDB
  for (let remoteItem of remoteData) {
    const localItem = localData.find(item => item.id === remoteItem.id);
    if (!localItem) {
      console.log(`Inserting new data for ${remoteItem.id} in ${storeName}`);
      store.put(remoteItem);
    }
  }
}

// Function to update the sync table in IndexedDB
async function updateSyncTable(db) {
  const syncTable = db.transaction('sync_table', 'readwrite').objectStore('sync_table');
  const currentTimestamp = Date.now();

  // Update the sync status for all records in sync_table
  const syncRequest = syncTable.getAll();
  syncRequest.onsuccess = function () {
    const syncRecords = syncRequest.result;

    for (let record of syncRecords) {
      record.lastSynced = currentTimestamp;
      syncTable.put(record);
    }

    console.log('Sync table updated successfully.');
  };
}

// Expose the sync function to be used when the user is online
export { syncDataWithFirestore };
