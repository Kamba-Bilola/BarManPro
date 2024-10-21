import React, { useState, useEffect } from 'react';
import { getObjectStoreDataExec } from '../database/indexedDB';
import './BarManagement';
import BarManagement from './BarManagement';
import { syncDataWithFirestore } from '../database/syncFromFirestore'; // Import the sync function

const RoleChecker = () => {
    const [role, setRole] = useState(null); // To store the user's role
    const [syncStatus, setSyncStatus] = useState(null); // To track sync status (e.g., "loading", "success", "error")
    const [error, setError] = useState(null); // To capture any sync errors
    const [bars, setBars] = useState([]); // To store bar data after sync
   

    // Fetch role from IndexedDB when the component mounts
    useEffect(() => {
        const fetchRoleFromIndexedDB = async () => {
            try {
                const loginSession = await getObjectStoreDataExec('Sessions', 1);
                const mainUserUid = loginSession.userId;
                const mainUser = await getObjectStoreDataExec('Users', mainUserUid);
                setRole(mainUser.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        fetchRoleFromIndexedDB();
    }, []);

    // Trigger the sync process when the component mounts
    useEffect(() => {
        const performSync = async () => {
            try {
                setSyncStatus('loading');
                const syncedBars = await syncDataWithFirestore(); // Trigger the sync function and get the bar data
                setBars(syncedBars); // Store the bars data
                setSyncStatus('success');
            } catch (err) {
                setSyncStatus('error');
                setError(err.message);
                console.error('Sync failed:', err);
            }
        };

        // Only sync if the user is online
        if (navigator.onLine) {
            performSync();
        }

        // Optionally, listen for when the user comes online and trigger the sync
        window.addEventListener('online', performSync);

        return () => {
            window.removeEventListener('online', performSync);
        };
    }, []);

    

    

    return (
        <div className="role-checker">
             {role === 'BarOwner' && <BarManagement role={'BarOwner'} syncStatus={syncStatus} setSyncStatus={setSyncStatus}   />}
            {role === 'Bartender' && <BarManagement role={'Bartender'} syncStatus={syncStatus} setSyncStatus={setSyncStatus}   />}
        </div>
    );
};

export default RoleChecker;
