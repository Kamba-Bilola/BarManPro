import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../../states/GlobalStateContext';
import { getAllObjectStoreDataExec } from '../../controllers/databaseControllers/indexedDbCrud';
import StockManagement from '../../controllers/componentsControllers/StockManagement';
const StockCheker = () => {
    const {stockData, setStockData} = useGlobalState();
    const loadStock = async () => {
        try {
              
          // Fetch data only if the object store exists
          const fetchedStock = await getAllObjectStoreDataExec("Products");
          console.log("::: fetchedStock ", fetchedStock);
      
        } catch (error) {
          console.error("Error loading stock:", error);
        }
      };
      
    
    loadStock();
    //useEffect(() => {}, []); 


    return (<div>
        <StockManagement/>
    </div> );
};

export default StockCheker;