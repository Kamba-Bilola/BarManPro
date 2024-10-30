import React, { useEffect, useState } from "react";
import { GlobalStateProvider, useGlobalState } from "./states/GlobalStateContext";
import SimulationComponent from "./components/specific/SimulationComponent";
import { checkIfDatabaseExists, createDatabase } from "./controllers/databaseControllers/IndexedDB";
import AlertNotification from "./components/specific/AlertNotification";
import { MutatingDots } from 'react-loader-spinner';
import AppStatusDisplay from "./components/specific/AppStatusDisplay";
import Configuration from "./views/pages/Configuration";
import Login from "./views/pages/Login";

const App = () => {
  const { DBstate, setDBstate, syncState, viewIndice,setViewIndice, mainView,mainUser, setMainUser,userRole, setUserRole,userConnected, setUserConnected} = useGlobalState();
  
  console.log(":::: ViewIndice ::",viewIndice);
    // Function to determine which page to show
    const renderPage = () => {
        switch (viewIndice) {
          case 0: return <main><Configuration/></main>;
          case 1: return <main><Login/></main>;
          case 2: return <main><p>Complete your profile please</p></main>;
          default:
            return <div>404 Page Introuvable</div>;
        }
      }
  useEffect(() => {
    const setMainView = async () => {
      if(mainUser){setViewIndice(2)}
      else{
      if(DBstate===true){ setViewIndice(1)}
      else{ setViewIndice(0)}
      }
      };
    setMainView();
  
  }, [DBstate]); 
  return (
   
       <div>{renderPage()}</div>
    
  );
};

export default App;