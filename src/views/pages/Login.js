import React, { useState, useEffect } from 'react';
import { GlobalStateProvider } from "../../states/GlobalStateContext";
import SimulationComponent from "../../components/specific/SimulationComponent";
import { MutatingDots } from "react-loader-spinner";
import AppStatusDisplay from "../../components/specific/AppStatusDisplay";
import DevOpsControls from "../../components/specific/DevOpsControls";
import IndicationBar from "../../components/specific/IndicationBar";
import logo from '../../assets/svg/logo.svg';
//import {handleFacebookLogin,handleLogout,handleGoogleLogin} from './login'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup,signInWithRedirect } from 'firebase/auth';
import { handleAddToDatastoreObject,getObjectStoreDataExec, handleRemoveDatabase,handleClearData,createDatabase, appDefaultConfData, addToObjectStoreExec,checkIfDatabaseExists,clearAllDataExec, removeDatabaseExec, getLastIdAndSet } from "../../controllers/databaseControllers/indexedDbCrud";
import { auth } from "../../controllers/databaseControllers/firebase";
import { useGlobalState } from '../../states/GlobalStateContext';
import welocomeImg from '../../assets/svg/welcome.webp';


const Login = () => {

const { DBstate, setDBstate, syncState,setSyncState, viewIndice,setViewIndice, mainView,userDetails, setUserDetails,userRole, setUserRole,userConnected, setUserConnected,manualLogIn, setmanualLogIn} = useGlobalState();

const prevManualLogin = manualLogIn;

useEffect(() => {
  const fetchUserData = async () => {
    if (manualLogIn !== prevManualLogin) {
      // Saving user after Google login
      const googleUser = auth.currentUser;
      if (googleUser) {
        const userUid = googleUser.uid;        
        // Await the data fetching
        try {
          const currentUserData = await getObjectStoreDataExec("Users", userUid);
          if(currentUserData){ 
            setUserDetails(prevDetails => ({ ...prevDetails || {},  mainUser: currentUserData }));
          }
          
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }
  };

  // Call the async function
  fetchUserData();

}, [manualLogIn]);

const googleLogin = async () => {
  
  const provider = new GoogleAuthProvider();

  // Handle first Session
const addFirstSession = async (userData) => {
  try {
    const firstSessionData = {
      barId: null,
      userId: userData.uid,
      sessionStart:Date.now(),
      sessionEnd: null,
      saleStart: null,
      saleEnd: null,
      totalSales: null,
      itemsSold: null,
      status: "logged In",
      dailySalesReportId: null,
      sessionReportId: null,
      itemSalesReportId: null,
      stockReportId: null,
    };
    const nextId = await getLastIdAndSet('Sessions');
    console.log(`Next ID to use: ${nextId}`);
    // Await the datastore function to ensure it's completed
    handleAddToDatastoreObject("Sessions", firstSessionData,nextId);

    // Return true if the operation succeeds
    console.log('First session set');
    return true;

  } catch (error) {
    console.log('Failed to set First login details:', error);

    // Return false in case of error
    return false;
  }
};


  try {
    const result = await signInWithRedirect(auth, provider);
    console.log("::: google login ", result);
    const user = result.user;    
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      createdAt:Date.now(),
      lastLoginAt:user.metadata.lastLoginAt,
      barControled: null,
      lastLoginAt: user.metadata.lastLoginAt,
      fullName: null,
      phone: null,
      password: null,
      role: null,
      Subscription: null
    };
    console.log('Google user:', userData);
    console.log(`Login successful! Welcome, ${userData.displayName}`);
    // Save user data to IndexedDB
    handleAddToDatastoreObject("Users", userData, user.uid);
    console.log("just here");
    const firstSes = addFirstSession(userData); 
    setmanualLogIn(true);  
    window.location.reload();
  } catch (error) {
    return false;
    console.log('Failed to log in with Google. Please try again.');
  }
  
};


  return (
   
      <div className="App">
         <div className="config-wrapp pt-4">     
            <div>
            <div className="googeleLogin ">
              <h4>Bienvenu sur BarManPro</h4>
              <p className="p-1 pt-1"> Votre gestionaire de bar optimisée, simple et efficace!</p>
              <img className="welcomeImg" src={welocomeImg} />
        <button className="btn btn-primary big-middle" onClick={googleLogin}  
        >Connectez-vous avec Google</button>
        </div>
            </div>
            <div className="logoblock">
                 
            </div>
           
            
       
        </div> 
      </div>
   
  );
};

export default Login;

 /* <button  onClick={HandleFacebookLogin}style={{ padding: '8px 16px', margin: '20px', backgroundColor: '#4285F4', color: 'white' }}
        > Login with Facebook</button>
          <button onClick={HandleLogout} style={{ padding: '10px 20px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '5px' }}
      > Logout </button>*/