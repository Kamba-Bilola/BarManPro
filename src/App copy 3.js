import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserState, setConfset,setSync } from './redux/slices/globalStateSlice';
import './App.css';
import { useSwipeable } from 'react-swipeable'; 
import IncompleteProfile from './components/IncompleteProfile';
import BarManagement from './components/BarManagement';
import StockManagement from './components/StockManagement';
import SalesEntry from './components/SalesEntry';
import UnpaidStock from './components/UnpaidStock';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import IndicationBar from './components/IndicationBar';
import { auth } from './database/firebase'; // Firebase initialization
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import {showNotification , handleAddToDatastoreObject,handleRemoveDatabase,handleClearData,createDatabase, appDefaultConfData,updateObjectStoreExec,deleteFromObjectStoreExec,getObjectStoreDataExec,getWhereFieldEqualsExec, addToObjectStoreExec,checkIfDatabaseExists,clearAllDataExec, removeDatabaseExec } from './database/indexedDB';
import {getUSerOnlineStatus} from './components/devOptions';
import {handleFacebookLogin,handleLogout,handleGoogleLogin,addFirstSsession} from './components/login'
import DevOpsControls from './components/DevOpsControls'; // Import your new component
import GoogleLogin from './components/GoogleLogin'; // Import your new component
import RoleChecker from './components/RoleChecker';
import LocationManagement from './components/LocationManagement';
// Add other necessary imports for components

const App = () => {
  const dispatch = useDispatch();
  const [routingMode, setRoutingMode] = useState(false); // Routing mode state
  const [activeRoute, setActiveRoute] = useState(null);  // Active route state
  // Initialize the route and setRoute using useState
  const [route, setRoute] = useState(null);
  // Accessing global state using useSelector
  const {
    confset, userState, mainRole, associated,
    subscStatus, preShift, dailyState, postShift,
    gap, shared, subscLevel, sync, notification,
  } = useSelector((state) => state.global);
  const [appMainUser, setAppMainUser] = useState();
  const [screenIndice,setScreenIndice]= useState();
  const [ barPermission, setBarPermission]= useState();
  const [ barsControlled, setBarsControlled]= useState();
  const [ barControlled, setBarControlled]= useState();
//COnsole log Hide and show
let originalConsoleLog = console.log; // Store the original console.log
let isConsoleLogVisible = true; // Flag to track whether logs are visible or hidden

 // Initialize the app, including database and user state
 const initializeApp = async () => {
  try {
    const dbExists = await checkIfDatabaseExists();
    if (!dbExists) {
      await createDatabase();
      dispatch(setConfset(true)); // Set the DB setup state
    } else {
      dispatch(setConfset(true)); // DB exists, continue
    }
    
    const loginSession = await getObjectStoreDataExec("Sessions", 1);
    if (loginSession) {
      const mainUserUid = loginSession.userId;
      const mainUser = await getObjectStoreDataExec("Users", mainUserUid);
      setAppMainUser(mainUser); // Set local user
      console.log(":::mainuser", appMainUser );
      dispatch(setUserState(mainUser ? 'complete' : 'incomplete' )); // Update userState based on completeness
    }

    const googleUser = auth.currentUser;
    if (googleUser) {
      const userUid = googleUser.uid;
      const currentUserData = await getObjectStoreDataExec("Users", userUid);
      dispatch(setUserState(currentUserData ? "complete" : "incomplete"));
    }
    

  } catch (error) {
    console.error("Initialization error:", error);
  }

};
async function getControlledBars(permissions) {
    const bars = [];
    // Iterate over each permission to get bar details
    for (const permission of permissions) {
        const barId = permission.barId;        
        try {
            // Fetch the bar associated with the current barId
            const bar = await getWhereFieldEqualsExec('Bars', 'uid', barId);
            // Check if the bar was found
            if (bar) {bars.push(bar); // Add the bar details to the bars list
            } else {console.error(`No bar found for barId: ${barId}`);}
        } catch (error) {console.error(`Error fetching bar with barId: ${barId}`, error); }
    }  return bars; }
const checkUserPermissions = async () => {
      try {
        console.log("appMainUser",appMainUser);
        const controlledBar = appMainUser.barControlled;
        // Check if the user has a barControlled field
        if (controlledBar) {
          setBarPermission(true);
        } else {
          // If barControlled is null, check the BarUserPermissions table
          //const permissions = await getObjectStoreDataExec('BarUserPermissions', appMainUser.uid);
          const permissions = await getWhereFieldEqualsExec('BarUserPermissions', 'userId', appMainUser.uid);
          const controlledBars = await getControlledBars(permissions);
          console.log("::: controlledBars : ",controlledBars);
          setBarsControlled(controlledBars);
          console.log("::: permissions : ",permissions);
          if (permissions) {
            // Check if all control fields are true and a barId exists
            const validPermission = permissions.find((perm) => 
              perm.canUpdateSales === true && 
              perm.canUpdateStock === true && 
              perm.barId
          ); 
          console.log(":::validPermission   :  ",validPermission);
            if (validPermission) {
              // Update the user's barControlled field in the Users table
              await updateObjectStoreExec('Users', currentUser.uid, { ...currentUser, barControlled: validPermission.barId });
              setAppMainUser((prev) => ({ ...prev, barControlled: validPermission.barId }));
              setBarPermission(true);
              
            }
          }
        }
      } catch (error) {
        console.error('Error checking user permissions:', error);
      }
    };

   

// Function to update `screenIndice` based on app state
const updateScreenIndice = () => {
  if(barPermission === true){setScreenIndice(4);}
  else if (userState === "complete") {setScreenIndice(3); }
  else if (userState === "incomplete") { setScreenIndice(2);} 
  else if (userState === null) { setScreenIndice(1); } 
  else if (confset === false) {setScreenIndice(0);}
  else {setScreenIndice(-1);}
};

useEffect(() => {initializeApp();}, [dispatch]);
useEffect(() => {updateScreenIndice();
  if (appMainUser) { console.log(":::mainuser (after state update)", appMainUser);
     // Trigger the permission check when the component mounts or when the currentUser changes
    checkUserPermissions();
  }
  
}, [confset,userState,barPermission,appMainUser]);

  // Function to determine which page to show
  const renderPage = () => {
    if (route) {
      switch (route) {
        case 'user-management':
          return <main><DevOpsControls setRoute={setRoute} /><UserManagement /></main>;
        case 'bar-management':
          return <main><DevOpsControls setRoute={setRoute} /><BarManagement /></main>;
        case 'stock-management':
          return <main><DevOpsControls setRoute={setRoute} /><StockManagement /></main>;
        case 'sales-entry':
          return <main><DevOpsControls setRoute={setRoute} /><SalesEntry /></main>;
        case 'unpaid-stock':
          return <main><DevOpsControls setRoute={setRoute} /><UnpaidStock /></main>;
        case 'reports':
          return <main><DevOpsControls setRoute={setRoute} /><Reports /></main>;
          case 'locations':
            return <main><DevOpsControls setRoute={setRoute} /><LocationManagement/></main>;
        default:
          return <div>404 Page Not Found</div>;
      }
    } else { 
      switch (screenIndice) {
        case 0: return <div>DB Not Set</div>;
        case 1: return ( <main> <DevOpsControls setRoute={setRoute} /> <GoogleLogin /> </main> );
        case 2:  return ( <main>  <DevOpsControls setRoute={setRoute} />  <IncompleteProfile /></main> );
        case 3: return ( <main>  <DevOpsControls setRoute={setRoute} /> <RoleChecker /> </main>  );
        case 4: return ( <main>  <DevOpsControls setRoute={setRoute} /> <p>Your are in</p> </main>  );
        default:   return <div>404 Page Not Found</div>;  }
    };
    }  
  return (
    <div>
      {renderPage()}
    </div>
  );
};

export default App;
