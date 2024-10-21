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
import {showNotification , handleAddToDatastoreObject,handleRemoveDatabase,handleClearData,createDatabase, appDefaultConfData,updateObjectStoreExec,deleteFromObjectStoreExec,getObjectStoreDataExec, addToObjectStoreExec,checkIfDatabaseExists,clearAllDataExec, removeDatabaseExec } from './database/indexedDB';
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
  
  

 
//COnsole log Hide and show
let originalConsoleLog = console.log; // Store the original console.log
let isConsoleLogVisible = true; // Flag to track whether logs are visible or hidden

const checkUserStatus = (currentUserData)  => {
  let thisUserStatus = null;
  console.log("checkUser status : ",currentUserData);
  const {Subscription, fullName,password,phone, role } = currentUserData;
      if((Subscription==null) || (fullName==null) || (password==null) || (phone==null) || (role==null)){
        console.log("profile incomplete");
        thisUserStatus = "incomplete";        
      }
      else{ console.log("hey-------------"); thisUserStatus = "complete"; }
  return thisUserStatus;
}
 


useEffect(() => {
  const initializeDatabase = async () => {
    const dbExists = await checkIfDatabaseExists();

    if (!dbExists) {
      // If the DB doesn't exist, create it
      try {
        await createDatabase(); // createDatabase should be a promise-based function
        dispatch(setConfset(true)); // Set confset to true after DB creation
        console.log("Database created successfully.");
      } catch (error) {
        console.error("Error creating database:", error);
        dispatch(setConfset(false)); // Set confset to false if DB creation fails
      }
    } else {

      //DB exist
      dispatch(setConfset(true)); // If DB exists, set confset to true

      // Event listener to handle sync status update
      const handleSyncStatusUpdate = (event) => {
        const syncStatus = event.detail;
        dispatch(setSync(syncStatus)); // Update sync state in global store
        console.log("Sync status:", syncStatus);
      };
      // Add event listener for custom syncStatusUpdate event
      window.addEventListener('syncStatusUpdate', handleSyncStatusUpdate);
      //user profile completion work


      dispatch(setUserState(null));

      //check if user has logged in before
      try {

        const loginSession = await getObjectStoreDataExec("Sessions", 1);
        if (loginSession === null) {
          console.log("I am null");
          //console.log("No data found with ID 1 in Sessions");
          // Handle the case for no session found
        } else {
          console.log("loginSession : ", loginSession);
          // Proceed with further logic
          console.log("loginSession : ", loginSession);
          const mainUserUid = loginSession.userId;
          const sessionStatus = loginSession.status;
          console.log(mainUserUid, sessionStatus);
          const mainUser = await getObjectStoreDataExec("Users", mainUserUid);
          console.log("mainUser : ",mainUser);
          dispatch(setUserState(checkUserStatus(mainUser))); 
        }
      } catch (error) {
        
        // Handle the error case
      }
      //saving user after google login
      const googelUser = auth.currentUser;
      if(googelUser){
      const userUid = googelUser.uid;
      const currentUserData = getObjectStoreDataExec("Users", userUid );
      console.log("currnetUserData:  ",currentUserData);      
      dispatch(setUserState(checkUserStatus(currentUserData)));
      dispatch(setUserState("incomplete"));
    }
    

     
      // Clean up event listener on component unmount
      return () => {  window.removeEventListener('syncStatusUpdate', handleSyncStatusUpdate);
      };
    }
  };

  initializeDatabase(); // Call the function inside useEffect
}, [dispatch]);


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
    
    if (confset==false) {return "DB NOT SET";}
    else{
      if (userState==null) {
        return  <main>
       <DevOpsControls setRoute={setRoute} />
       <GoogleLogin/>
    </main>;
      }
      else{
        if (userState=="incomplete") {
        return  <main><DevOpsControls setRoute={setRoute} /><IncompleteProfile/></main>
        }else if (userState === "complete") {
          // Render a different component after the profile is complete
          return (
            <main><DevOpsControls setRoute={setRoute} /><RoleChecker/></main>
          );
      }
        else{  }
    
    } 
  }}  
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
};

export default App;
