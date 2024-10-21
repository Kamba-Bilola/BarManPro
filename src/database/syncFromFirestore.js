import { myFirestoreDb } from './firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { openDB } from './indexedDB';

// Function to sync Firestore to IndexedDB in batches and efficiently
async function syncDataWithFirestore() {
  try {
    const db = await openDB();

    // Sync each collection
    await syncFirestoreCollection(db, 'Bars');
    await syncFirestoreCollection(db, 'Users');
    await syncFirestoreCollection(db, 'Stock');

    // Update sync table
    await updateSyncTable(db);
  } catch (error) {
    console.error('Error syncing data:', error);
  }
}

// Optimized sync for Firestore collections with IndexedDB
async function syncFirestoreCollection(db, collectionName) {
  const collectionRef = collection(myFirestoreDb, collectionName);

  // Real-time listener for Firestore changes
  onSnapshot(collectionRef, async (snapshot) => {
    const remoteData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Fetch the corresponding data from IndexedDB
    const localData = await fetchIndexedDBData(db, collectionName);

    // Use maps for fast comparison
    const localDataMap = new Map(localData.map(item => [item.id, item]));
    const remoteDataMap = new Map(remoteData.map(item => [item.id, item]));

    const store = db.transaction(collectionName, 'readwrite').objectStore(collectionName);

    // Batch insert/update operations
    const batchUpdate = [];

    // Insert or update new/changed data from Firestore
    for (let [id, remoteItem] of remoteDataMap.entries()) {
      const localItem = localDataMap.get(id);
      if (!localItem || JSON.stringify(localItem) !== JSON.stringify(remoteItem)) {
        // Data is either new or updated, so add it to the batch
        batchUpdate.push(store.put(remoteItem));
      }
    }

    // Remove deleted items from IndexedDB
    for (let [id] of localDataMap.entries()) {
      if (!remoteDataMap.has(id)) {
        // Record no longer exists in Firestore, delete from IndexedDB
        batchUpdate.push(store.delete(id));
      }
    }

    // Wait for all updates to complete
    await Promise.all(batchUpdate);
    console.log(`Synced ${collectionName} collection successfully.`);
  });
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

// Function to update the sync table in IndexedDB
async function updateSyncTable(db) {
  const syncTable = db.transaction('sync_table', 'readwrite').objectStore('sync_table');
  const currentTimestamp = Date.now();

  // Update sync status in sync_table
  const syncRequest = syncTable.getAll();
  syncRequest.onsuccess = function () {
    const syncRecords = syncRequest.result;
    syncRecords.forEach(record => {
      record.lastSynced = currentTimestamp;
      syncTable.put(record);
    });
    console.log('Sync table updated successfully.');
  };
}

export { syncDataWithFirestore };
