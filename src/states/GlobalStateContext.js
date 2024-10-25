import React, { createContext, useState, useContext } from "react";

// Create a combined context for all global states
const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  // App States
  const [DBstate, setDBstate] = useState(false); // Set default value properly
  const [syncState, setSyncState] = useState("pending");
  const [viewIndice, setViewIndice] = useState(0);
  const [mainView, setMainView] = useState("Dashboard");

  // Login States
  const [userDetails, setUserDetails] = useState({});
  const [userRole, setUserRole] = useState("user");
  const [userConnected, setUserConnected] = useState(false);

  // Bars States
  const [mainBars, setMainBars] = useState([]);
  const [bars, setBars] = useState([]);
  const [barMans, setBarMans] = useState([]);
  const [paymentState, setPaymentState] = useState("pending");
  const [barStatus, setBarStatus] = useState("inactive");

  // Stock and Sales States
  const [stockData, setStockData] = useState([]);
  const [stockStatus, setStockStatus] = useState("fine");
  const [sessionStatus, setSessionStatus] = useState("finished");
  const [salesReport, setSalesReport] = useState([]);
  const [gapStatus, setGapStatus] = useState("pending");

  return (
    <GlobalStateContext.Provider
      value={{
        // App states
        DBstate, setDBstate, syncState, setSyncState, viewIndice, setViewIndice, mainView, setMainView,

        // Login states
        userDetails, setUserDetails, userRole, setUserRole, userConnected, setUserConnected,

        // Bars states
        mainBars, setMainBars, bars, setBars, barMans, setBarMans, paymentState, setPaymentState, barStatus, setBarStatus,

        // Stock and Sales states
        stockData, setStockData, stockStatus, setStockStatus, sessionStatus, setSessionStatus, salesReport, setSalesReport, gapStatus, setGapStatus
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to use the GlobalStateContext
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
