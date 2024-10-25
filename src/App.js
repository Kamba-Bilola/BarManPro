import React, { useEffect, useState } from "react";
import { GlobalStateProvider, useGlobalState } from "./states/GlobalStateContext";
import SimulationComponent from "./components/specific/SimulationComponent";
import { checkIfDatabaseExists, createDatabase } from "./controllers/databaseControllers/IndexedDB";
import AlertNotification from "./components/specific/AlertNotification";
import { MutatingDots } from 'react-loader-spinner';
import AppStatusDisplay from "./components/specific/ AppStatusDisplay";
import Configuration from "./views/pages/Configuration";

const App = () => {
  const { DBstate, setDBstate, syncState, viewIndice,setViewIndice, mainView } = useGlobalState();
    // Function to determine which page to show
    const renderPage = () => {
        switch (viewIndice) {
          case 0:
            return <main><Configuration/></main>;
          default:
            return <div>404 Page Introuvable</div>;
        }
      }
  useEffect(() => {
    const setMainView = async () => {
      if(DBstate===true){setViewIndice(0)}
      else{
       
      }
    };
    setMainView();
  }, [DBstate]); 
  return (
   
       <div>{renderPage()}</div>
    
  );
};

export default App;