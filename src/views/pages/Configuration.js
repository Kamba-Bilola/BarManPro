import React from "react";
import { GlobalStateProvider } from "../../states/GlobalStateContext";
import SimulationComponent from "../../components/specific/SimulationComponent";
import { MutatingDots } from "react-loader-spinner";
import AppStatusDisplay from "../../components/specific/AppStatusDisplay";
import DevOpsControls from "../../components/specific/DevOpsControls";
import IndicationBar from "../../components/specific/IndicationBar";
import logo from '../../assets/svg/logo.svg';

const Configuration = () => {
  return (
   
      <div className="App">
        <SimulationComponent /> 
        <DevOpsControls/>
        <IndicationBar/>
         <div className="config-wrapp">     
            <div><MutatingDots visible={true} height="100" width="100" color="#fff" secondaryColor="#fefefe" radius="12.5" ariaLabel="mutating-dots-loading" wrapperStyle={{}}  wrapperClass="" /><AppStatusDisplay /></div>
            <div className="logoblock">
            <img src={logo} alt="Bar Man Pro" />
            <h1>Bar Man Pro</h1>            
            </div>
           
            
       
        </div> 
      </div>
   
  );
};

export default Configuration;