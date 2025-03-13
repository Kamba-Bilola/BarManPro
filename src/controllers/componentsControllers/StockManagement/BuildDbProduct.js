export const buildDbProduct = async (
    product, 
    mainBar, 
    defaultBar, 
    checkBeforeCRUDExec, 
    addToObjectStoreExec, 
    getLastIdAndSet, 
    uploadFile, 
    loadProducts, 
    setShowForm
  ) => {  
    try {
      // Generate new Product ID
      const lastId = await getLastIdAndSet("Products");
      const newId = lastId !== null && lastId !== undefined ? lastId : 1;
  
      // Get main bar ID
      const mainBarUid = mainBar && mainBar.length > 0 ? mainBar.uid : defaultBar.uid;
  
      // Create product object
      const dBProduct = {
        id: newId,
        name: product.name,
        category: product.category,
        barId: mainBarUid
      };
  
      // Check if the product can be inserted
      const productCanBeInserted = await checkBeforeCRUDExec('Products', dBProduct);
      if (!productCanBeInserted[0]) {
        console.error("❌ Error: Product cannot be inserted");
        return;
      }
  
      // Insert product into IndexedDB
      await addToObjectStoreExec('Products', dBProduct, null);
      await loadProducts();
      setShowForm(false);
  
      // Generate new default variation ID
      const defaultVariationId = await getLastIdAndSet("Variations");
      const newDfVariationId = defaultVariationId !== null && defaultVariationId !== undefined ? defaultVariationId : 1;
  
      // Upload default variation image
      let imageFile = await uploadFile(product.image);
      let myImageUrl = imageFile.fileUrl;
  
      // Create default variation object
      const dBDefaultVariation = {
        id: newDfVariationId,
        productId: newId,
        price: product.price,
        imageUrl: myImageUrl,
        capacity: product.defaultAttributes.capacity,
        packaging: product.defaultAttributes.packaging,
        flavor: product.defaultAttributes.flavor,
        isDefault: true
      };
  
      // Check if default variation can be inserted
      const dfVariationCanBeInserted = await checkBeforeCRUDExec('Variations', dBDefaultVariation);
      if (!dfVariationCanBeInserted[0]) {
        console.error("❌ Error: Default variation cannot be inserted");
        return;
      }
  
      // Insert default variation into IndexedDB
      await addToObjectStoreExec('Variations', dBDefaultVariation, null);
      await loadProducts();
      setShowForm(false);
  
      // Handle additional variants if the product has them
      if (product.hasVariants === true) {
        let dBVariationId = newDfVariationId + 1;
  
        for (let i = 0; i < product.variants.length; i++) {
          dBVariationId += i;
  
          // Upload variant image (if exists)
          let variantImageUrl = product.variants[i].image ? (await uploadFile(product.variants[i].image)).fileUrl : null;
  
          // Create variant object
          const dBVariation = {
            id: dBVariationId,
            productId: newId,
            price: product.variants[i].price,
            imageUrl: variantImageUrl,
            capacity: product.variants[i].capacity,
            packaging: product.variants[i].packaging,
            flavor: product.variants[i].flavor,
            isDefault: false
          };
  
          // Check if the variant can be inserted
          const dbVariationCanBeInserted = await checkBeforeCRUDExec('Variations', dBVariation);
          if (!dbVariationCanBeInserted[0]) {
            console.error("❌ Error: Variation cannot be inserted");
            continue;
          }
  
          // Insert variant into IndexedDB
          await addToObjectStoreExec('Variations', dBVariation, null);
          await loadProducts();
          setShowForm(false);
        }
      }
  
      console.log("✅ Product and variations successfully saved.");
    } catch (error) {
      console.error("❌ Error saving product:", error);
    }
  };
  