import React from "react";
import { useGlobalState } from "../../states/GlobalStateContext";


const SimulationComponent = () => {
  // Access all global states via the custom hook
  const {
    DBstate, setDBstate, syncState, setSyncState, view, setView, mainView, setMainView,
    userDetails, setUserDetails, userRole, setUserRole, userConnected, setUserConnected,
    mainBars, setMainBars, bars, setBars, barMans, setBarMans, paymentState, setPaymentState, barStatus, setBarStatus,
    stockData, setStockData, stockStatus, setStockStatus, sessionStatus, setSessionStatus, salesReport, setSalesReport, gapStatus, setGapStatus
  } = useGlobalState();

  return (
    <div>
      <h2>Global State Simulation</h2>
      
      {/* App State Simulation */}
      <section>
        <h3>App States</h3>
        <label>DB State:</label>
        <select value={DBstate} onChange={(e) => setDBstate(e.target.value === "true")}>
          <option value="true">Exists</option>
          <option value="false">Not Set</option>
        </select>

        <label>Sync State:</label>
        <select value={syncState} onChange={(e) => setSyncState(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="synced">Synced</option>
        </select>

        <label>Main View:</label>
        <select value={mainView} onChange={(e) => setMainView(e.target.value)}>
          <option value="Dashboard">Dashboard</option>
          <option value="UserManagement">User Management</option>
        </select>

        <label>View Number:</label>
        <input type="number" value={view} onChange={(e) => setView(parseInt(e.target.value))} />
      </section>

      {/* Add other sections for Login, Bars, Stock, Sales, etc. */}
    </div>
  );
};

export default SimulationComponent;