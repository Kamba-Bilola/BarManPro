let lastStoreCheckId = null; // Declare globally
export const saveInventory = async (quantities,mainUser,mainBar,defaultBar,checkBeforeCRUDExec,addToObjectStoreExec,getLastIdAndSet
  ) => {
    let response = { success: false, message: "Failed to save inventory!" };

    try {
      const lastId = await getLastIdAndSet("StoreChecks");
      const newId = lastId !== null && lastId !== undefined ? lastId : 1;
      const userUid = mainUser ? mainUser.uid : null;
      const mainBarUid = mainBar && mainBar.length > 0 ? mainBar.uid : defaultBar.uid;
      const todaysDate = new Date();
  
      const dBInventory = {
        id: newId,
        barId: mainBarUid,
        userId: userUid,
        checkType: "Check Before sale",
        checkTime: todaysDate
      };
  
      const canBeInserted = await checkBeforeCRUDExec('StoreChecks', dBInventory);
      if (!canBeInserted[0]) {
        console.log("❌ Error: StoreCheck cannot be inserted");
        return;
      }
  
      const myStoreCheckId = await addToObjectStoreExec('StoreChecks', dBInventory, null);
      if (!myStoreCheckId) return;
      lastStoreCheckId = myStoreCheckId; 
  
      // Process each item in quantities
      await Promise.all(
        quantities.map(async (item, index) => {
          const lastItemId = await getLastIdAndSet("ItemReport");
          const newItemId = lastItemId !== null && lastItemId !== undefined ? lastItemId + index : index + 1;
  
          const dBItem = {
            id: newItemId,
            ref: "StoreCheck",
            refId: myStoreCheckId,
            productId: item.productId,
            variationId: item.variantId,
            quantity: item.value + 1,
            barId: mainBarUid,
            priceValue: item.total
          };
  
          console.log("Adding ItemReport:", dBItem);
          const canInsertItem = await checkBeforeCRUDExec('ItemReport', dBItem);
          if (canInsertItem[0]) {
            await addToObjectStoreExec('ItemReport', dBItem, null);
          } else {
            console.error(`❌ ItemReport cannot be inserted:`, dBItem);
          }
        })
      );
  
      console.log("✅ Inventory successfully saved.");
      response = { success: true, message: "✅ Inventory successfully saved!" };
    } catch (error) {
      console.error("❌ Error saving inventory:", error);
    }
    return response; // Return the response
  };

  // Export a function to access the lastStoreCheckId
export const getLastStoreCheckId = () => lastStoreCheckId;
  