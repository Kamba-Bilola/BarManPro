import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../states/GlobalStateContext";
import { checkIfDatabaseExists, createDatabase } from "../../controllers/databaseControllers/IndexedDB";


const AppStatusDisplay = () => {
    const [notification, setNotification] = useState();
    const { DBstate, setDBstate, syncState, viewIndice,setViewIndice, mainView } = useGlobalState();
    const [appMessage, setAppMessage] = useState("");
    const dbExists = null;
  
    
    useEffect(() => {
      const checkDatabase = async () => {
        try {
          let dbExists = await checkIfDatabaseExists();
          if(!dbExists){
            try {await createDatabase(); }
            catch (error) {
              setNotification({
                type: 'error',
                messages: ["Un problème Code 1 est survenue lors de la configuration"]
            });
            }
          }
      if (dbExists !== DBstate) {
        setDBstate(dbExists); // Set DBstate based on the existence of the database
      }        
        } catch (error) {
          console.error("Error checking database:", error);
          setDBstate(false); // In case of an error, set DBstate to false
        }
      };
  
      checkDatabase();
    }, [setDBstate]); // Dependency array includes setDBstate
    useEffect(() => {
      
      if (DBstate) {
        setAppMessage("Applicantion en cours de configuration.");
      } else {
        setAppMessage("Database not set");
      }
    }, [DBstate]);
  
    useEffect(() => {
      if (syncState === "synced") {
        setAppMessage((prev) => `${prev} | All data synced`);
      } else {
        setAppMessage((prev) => `${prev} | Sync pending`);
      }
    }, [syncState]);
  
    useEffect(() => {
      if (viewIndice === 0) {
        setAppMessage((prev) => `${prev} | Dashboard view`);
      } else {
        setAppMessage((prev) => `${prev} | View number ${viewIndice} selected`);
      }
    }, [viewIndice]);
  
    useEffect(() => {
      setAppMessage((prev) => `${prev} | Current main view: ${mainView}`);
    }, [mainView]);
  
    return (
        <p className="app-status-message">{appMessage}</p>    
    );
  };


  export default AppStatusDisplay;