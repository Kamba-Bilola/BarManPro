import React from 'react';
import { handleClearData, handleRemoveDatabase, handleAddToDatastoreObject, appDefaultConfData } from '../database/indexedDB'; // Adjust the path based on your file structure
import IndicationBar  from './IndicationBar';
const DevOpsControls = ({ setRoute }) => {
  const handleSyncClick = async () => {
    window.location.reload();
};
  return (
    <div className="devops">
      <a href="/" >Back Home</a>
      <button onClick={handleClearData}>Clear All Data</button>
      <button onClick={handleRemoveDatabase}>Remove Database</button>
      <button onClick={() => handleAddToDatastoreObject("app_conf", appDefaultConfData)}>Add default conf</button>

{/* Add routing buttons */}

<button onClick={() => { console.log('Route: User Management'); setRoute('user-management'); }}>Go to User Management</button>
<button onClick={() => { console.log('Route: Bar Management'); setRoute('bar-management'); }}>Go to Bar Management</button>
      <button onClick={() => { console.log('Route: Stock Management'); setRoute('stock-management'); }}>Go to Stock Management</button>
      <button onClick={() => { console.log('Route: Sales Entry'); setRoute('sales-entry'); }}>Go to Sales Entry</button>
      <button onClick={() => { console.log('Route: Unpaid Stock'); setRoute('unpaid-stock'); }}>Go to Unpaid Stock</button>
      <button onClick={() => { console.log('Route: Reports'); setRoute('reports'); }}>Go to Reports</button>
      <button onClick={() => { console.log('Route: Locations'); setRoute('locations'); }}>Go to Locations</button>
      <button onClick={handleSyncClick} >Rafraichir</button>
      
    
    </div>
  );
};

export default DevOpsControls;
