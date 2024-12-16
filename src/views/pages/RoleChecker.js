import React, { useState, useEffect } from 'react';
import { getObjectStoreDataExec, getAllObjectStoreDataExec } from '../../controllers/databaseControllers/indexedDbCrud';
import { syncDataWithFirestore } from '../../controllers/databaseControllers/syncFromFirestore';
import BarManagement from '../../controllers/componentsControllers/BarManagement';
import { useGlobalState } from '../../states/GlobalStateContext';

// Extract frequently used strings into constants
const OBJECT_STORES = {
    SESSIONS: 'Sessions',
    USERS: 'Users',
    BAR_USER_PERMISSIONS: 'BarUserPermissions',
};

const RoleChecker = () => {
    const { mainBarList, setMainBarList } = useGlobalState();
    const [role, setRole] = useState(null); // To store the user's role
    const [syncStatus, setSyncStatus] = useState(null); // To track sync status ("loading", "success", "error")
    const [error, setError] = useState(null); // To capture any sync errors
    const [bars, setBars] = useState([]); // To store bar data after sync

    // Fetch role from IndexedDB when the component mounts
    useEffect(() => {
        const fetchRoleFromIndexedDB = async () => {
            try {
                const loginSession = await getObjectStoreDataExec(OBJECT_STORES.SESSIONS, 1);
                if (!loginSession?.userId) throw new Error('No valid login session found');
                const mainUser = await getObjectStoreDataExec(OBJECT_STORES.USERS, loginSession.userId);
                setRole(mainUser?.role || null); // Fallback to null if role is missing
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
                const syncedBars = await syncDataWithFirestore(); // Sync bar data from Firestore
                setBars(syncedBars);
                setSyncStatus('success');
            } catch (err) {
                setSyncStatus('error');
                setError(err.message);
                console.error('Sync failed:', err);
            }
        };

        if (navigator.onLine) performSync();

        // Listen for when the user comes online and trigger the sync
        const handleOnline = () => performSync();
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    // Load main bars and update the global state if necessary
    useEffect(() => {
        const loadMainBars = async () => {
            try {
                const fetchedMainBarList = await getAllObjectStoreDataExec(OBJECT_STORES.BAR_USER_PERMISSIONS);
                if (JSON.stringify(fetchedMainBarList) !== JSON.stringify(mainBarList)) {
                    setMainBarList(fetchedMainBarList); // Only update if there are changes
                }
            } catch (error) {
                console.error('Error fetching main bars:', error);
            }
        };

        loadMainBars();
    }, [mainBarList, setMainBarList]);

    // Render logic
    const renderBarManagement = () => {
        if (!role) return <div>Loading role...</div>;
        if (role === 'BarOwner' || role === 'Bartender') {
            return <BarManagement role={role} syncStatus={syncStatus} setSyncStatus={setSyncStatus} />;
        }
        return <div>Access denied. Contact support for help.</div>; // Fallback for invalid roles
    };

    return (
        <div className="role-checker p-4">
            {error && <div className="error-message">Error: {error}</div>} {/* Show error messages */}
            {renderBarManagement()}
        </div>
    );
};

export default RoleChecker;
