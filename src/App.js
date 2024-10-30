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
  const { DBstate, setDBstate, syncState, viewIndice,setViewIndice, mainView,userDetails, setUserDetails,userRole, setUserRole,userConnected, setUserConnected} = useGlobalState();
  const user = userDetails?.mainUser;
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
      if(DBstate===true){setViewIndice(0)}
      else{
       if(!userDetails){setViewIndice(1)}
      else{setViewIndice(2)}
      }
    };
    setMainView();
  }, [DBstate]); 
  return (
   
       <div>{renderPage()}</div>
    
  );
};

export default App;