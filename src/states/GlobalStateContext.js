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
  const [userState, setUserState] = useState("incomplete");
  const [mainUser, setMainUser] = useState({
     uid:null,
     displayName:null,
     photoURL:null,
     email:null,
     createdAt:null,
     lastLoginAt:null,
     barControled : null,
     fullName : null,
     phone : null,
     password : null,
     role : null,
     Subscription : null,
     id:null,
     isConnected: null,
     sessionStatus:null
  
});

  // Bars States
  const [mainBar,setMainBar] = useState([]);
  const [defaultBar,setDefaultBar] = useState([]);
  const [mainBarList, setMainBarList] = useState([]);
  const [barList, setBarList] = useState([]);
  const [barMans, setBarMans] = useState([]);
  const [paymentState, setPaymentState] = useState("pending");
  const [barStatus, setBarStatus] = useState("inactive");

  // Stock and Sales States
  const [stockData, setStockData] = useState([]);
  const [stockStatus, setStockStatus] = useState();
  const [sessionStatus, setSessionStatus] = useState();
  const [salesReport, setSalesReport] = useState([]);
  const [gapStatus, setGapStatus] = useState("pending");

  return (
    <GlobalStateContext.Provider
      value={{
        // App states
        DBstate, setDBstate, syncState, setSyncState, viewIndice, setViewIndice, mainView, setMainView,

        // Login states
        userState, setUserState,mainUser, setMainUser,
        // Bars states
        mainBar,setMainBar,mainBarList, setMainBarList, barList, setBarList, barMans, setBarMans, paymentState, setPaymentState, barStatus, setBarStatus,defaultBar,setDefaultBar,
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
