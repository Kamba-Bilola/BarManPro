import React, { useEffect, useState,useRef } from "react";
import { useGlobalState } from "../../states/GlobalStateContext";
import { checkIfDatabaseExists, createDatabase } from "../../controllers/databaseControllers/IndexedDB";
import { getWhereFieldEqualsExec,getObjectStoreDataExec } from "../../controllers/databaseControllers/indexedDbCrud";

const AppStatusDisplay = () => {
    const [notification, setNotification] = useState();
    const { DBstate, setDBstate, syncState,setSyncState, viewIndice,setViewIndice, mainView,mainUser, setMainUser,userState, setUserState} = useGlobalState();
    const [appMessage, setAppMessage] = useState("");
    const dbExists = null;
    let mySyncStatus = null;

    useEffect(() => {
      let userDetails = null;
      let hasLoggedInBefore = false;
      const getUserDetails = async () => {
        try {
          const loginSession = await getObjectStoreDataExec("Sessions", 1);
          if (!loginSession) {
            hasLoggedInBefore = false;
            return; // exit early if there's no session
          } else {
            hasLoggedInBefore = true;
          }
      
          const mainUserUid = loginSession.userId;
          const sessionStatus = loginSession.status;
          const userDB = await getObjectStoreDataExec("Users", mainUserUid);
      
          const connectStatus = navigator.onLine;
          
          setMainUser({
            uid: userDB.uid,
            displayName: userDB.displayName,
            photoURL: userDB.photoURL,
            email: userDB.email,
            createdAt: userDB.createdAt,
            lastLoginAt: userDB.lastLoginAt,
            barControled: userDB.barControled,
            fullName: userDB.fullName,
            phone: userDB.phone,
            role: userDB.role,
            Subscription: userDB.Subscription,
            id: userDB.id,
            isConnected: connectStatus,
            sessionStatus: sessionStatus
          });
          
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      
  
      getUserDetails();
    }, [DBstate]); // Dependency array includes setDBstate
    

    useEffect(() => {
      if(mainUser && mainUser.uid && mainUser.phone && mainUser.password){setUserState("complete");}
    }, [mainUser]);

    

    useEffect(() => {

     

      const checkDatabase = async () => {
        try {
          let dbExists = await checkIfDatabaseExists();
          if(!dbExists){ try {await createDatabase(); } catch (error) {setDBstate(false);}}
          else{
          
           mySyncStatus = getWhereFieldEqualsExec("sync_table", "status", "pending");
           if (mySyncStatus !== syncState) { setSyncState(mySyncStatus);}
           
          }
          //make sur to update DBstate when needed
          if (dbExists !== DBstate) { setDBstate(dbExists);} 
             
          
        } catch (error) { setDBstate(false); // In case of an error, set DBstate to false
        }
      };
  
      checkDatabase();
    }, [setDBstate,syncState]); // Dependency array includes setDBstate
    
     
  
    return (
        <p className="app-status-message">{appMessage}</p>    
    );
  };


  export default AppStatusDisplay;