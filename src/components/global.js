import React, { createContext, useContext, useState } from 'react';

// Create the context
export const GlobalContext = createContext();

// Provide the global state
export const GlobalProvider = ({ children }) => {
  const [barPermission, setBarPermission] = useState(false); // Default false
  const [currentUser, setCurrentUser] = useState({ uid: '', barControlled: null });

  return (
    <GlobalContext.Provider value={{ barPermission, setBarPermission, currentUser, setCurrentUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook to use the global context
export const useGlobalContext = () => useContext(GlobalContext);
