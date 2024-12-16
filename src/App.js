import React, { useEffect, useState } from "react";
import { GlobalStateProvider, useGlobalState } from "./states/GlobalStateContext";
import SimulationComponent from "./components/specific/SimulationComponent";
import { checkIfDatabaseExists, createDatabase } from "./controllers/databaseControllers/IndexedDB";
import AlertNotification from "./components/specific/AlertNotification";
import { MutatingDots } from 'react-loader-spinner';
import AppStatusDisplay from "./components/specific/AppStatusDisplay";
import Configuration from "./views/pages/Configuration";
import Login from "./views/pages/Login";
import IncompleteProfile from "./views/pages/IncompleteProfile";
import DevOpsControls from "./components/specific/DevOpsControls";
import IndicationBar from "./components/specific/IndicationBar";
import RoleChecker from "./views/pages/RoleChecker";
import StockCheker from "./views/pages/StockCheker";
const App = () => {
  const { DBstate, setDBstate, syncState, viewIndice,setViewIndice, mainView,mainUser, setMainUser,userRole, setUserRole,userConnected, setUserConnected,userState, setUserState,barList,mainBarList} = useGlobalState();
  const [routingMode, setRoutingMode] = useState(false); // Routing mode state
  const [activeRoute, setActiveRoute] = useState(null);  // Active route state
  // Initialize the route and setRoute using useState
  const [route, setRoute] = useState(null);

    // Function to determine which page to show
    const renderPage = () => {
        switch (viewIndice) {
          case 0: return <main><Configuration/></main>;
          case 1: return <main><Login/></main>;
          case 2: return <main><IncompleteProfile/></main>;
          case 3: return <main><RoleChecker/></main>;
          case 4: return <main><StockCheker/></main>;
          default:
            return <div>404 Page Introuvable</div>;
        }
      }
     
  useEffect(() => {
    
    const setMainView = async () => { 

    
      
      if( mainUser.phone && mainUser.password ){
        setViewIndice(3);   
        
          if(mainUser.role=="Bartender"){            
          if(mainBarList.length>0){ setViewIndice(4); } 
          }
          if(mainUser.role=="BarOwner"){ 
            if(barList.length>0){ setViewIndice(4); } }
      }
      else {if(mainUser && mainUser.uid){setViewIndice(2)}
      else{
      if(DBstate===true){ setViewIndice(1)}
      else{ setViewIndice(0)}
      }
      }};
    setMainView();
  
  }, [DBstate,mainUser,userState,barList]); 

  return (
   
       <div>
      <div className="App">
      <SimulationComponent /> 
       <DevOpsControls/>
       <IndicationBar/>
        <div className="config-wrapp pb-4"> {renderPage()}</div>
        <div className="footer p-1 pt-4 mb-4"><p>© BarManPro tous droits réservés</p></div>
        </div>        
        </div>
    
  );
};

export default App;