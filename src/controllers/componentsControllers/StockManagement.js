import React, { useState, useRef, useEffect } from "react";
import cameraSvg from '../../assets/svg/photo-camera.svg';
import uploadSvg from '../../assets/svg/upload.svg';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { getAllObjectStoreDataExec, addToObjectStoreExec,updateObjectStoreExec,deleteFromObjectStoreExec,getObjectStoreDataExec,getLastIdAndSet,getWhereFieldEqualsExec,setFieldValues } from '../databaseControllers/indexedDbCrud';
import { useGlobalState } from "../../states/GlobalStateContext";
import { checkBeforeCRUDExec } from "../databaseControllers/verification";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InlineEditableText from "../../components/common/InlineEditableText";
import { saveInventory, getLastStoreCheckId } from "./StockManagement/SaveInventory";
import ReportGenerator from "./ReportGenerator";

const StockManagement = () => {
  const [inventoryStatus, setInventoryStatus] = useState(null); // To store the message
  const [showViewInventory, setShowViewInventory] = useState(false); // Show button on success
  const [reportId,setReportId] = useState(null);
  let myImageUrl = null;
  const [progress, setProgress] = useState({started:false,pc:0});
  const [msg, setMsg] = useState(null);
  const [totalSum, setTotalSum] = useState(0);
  const [forceRender, setForceRender] = useState(0);
  let myMainBar = null;
  let  barId = null;
  const { mainUser,barList,mainBarList, mainBar, setMainBar,defaultBar,setDefaultBar } = useGlobalState();
  const [showForm, setShowForm] = useState(false);
  const [activeInventory,setActiveInventory] = useState(false);
  const [inventory, setInventory] = useState({});
  const [validatedPhoto, setValidatedPhoto] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: null,
    defaultAttributes: {
      capacity: "",
      packaging: "",
      flavor: "",
    },
    hasVariants: false,
    variants: [],
  });
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [variationList, setVariationList] = useState([]);
  let myProductList = null;
 let dBProduct= {id:null, name:"",category: "",barId:null };
  let DBVariants =[];
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    barId: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [isEditingProduct, setIsEditingProduct] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isCameraOpen, setIsCameraOpen] =  useState({ open: false, target: null });
  const [capturedImage, setCapturedImage] = useState(null);
  const [currentVariants, setCurrentVariants] = useState({});
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [quantities, setQuantities] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleDefaultAttributeChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      defaultAttributes: { ...product.defaultAttributes, [name]: value },
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("---file :  ", file);
    setProduct({ ...product, image: file });
  };

  const handleAddVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { capacity: "", packaging: "", flavor: "", price: "", image: null },
      ],
    });
  };
  const fileInputRef = useRef(null);

  // Trigger file input when image is clicked
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = product.variants.map((variant, idx) =>
      idx === index ? { ...variant, [name]: value } : variant
    );
    setProduct({ ...product, variants: updatedVariants });
  };

  const handleVariantImageChange = (index, e) => {
    const file = e.target.files[0];
    const updatedVariants = product.variants.map((variant, idx) =>
      idx === index ? { ...variant, image: file} : variant
    );
    setProduct({ ...product, variants: updatedVariants });
};
// In your StockManagement component, add a function like:
const handleRemoveVariant = (index) => {
  setProduct((prevProduct) => ({
    ...prevProduct,
    variants: prevProduct.variants.filter((_, idx) => idx !== index)
  }));
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    await  builddBProduct(product);
    await loadProducts();
  };
  
  const checkAndInsertToDb = async (myObject,tableName) => {
    const canObjectBeInserted = await checkBeforeCRUDExec(tableName, myObject);
    if (canObjectBeInserted[0] === true) {
      try { await addToObjectStoreExec(tableName, myObject, null); }
      catch (error) {console.error("Product can not  be inserted:", error);}}
    else{console.log("Error : Product can not  be inserted"); }

   
  };
  
  
  const builddBProduct = async (product) => {  
  const lastId = await getLastIdAndSet("Products"); 
  const newId = lastId !== null && lastId !== undefined ? lastId : 1;
  let mainBarUid = null;
  if(mainBar && mainBar.length > 0){
    mainBarUid =mainBar.uid;
  }
  else {mainBarUid = defaultBar.uid;}
 
  dBProduct = { id:newId, name:product.name,category: product.category,barId:mainBarUid};
  const prodcutCanBeInserted = await checkBeforeCRUDExec('Products', dBProduct);
  if (prodcutCanBeInserted[0] === true) {
  try {
    await addToObjectStoreExec('Products', dBProduct, null);
    await loadProducts();
    setShowForm(false);
  }
  catch (error) {console.error("Product can not  be inserted:", error);}
   
  }
  else{console.log("Error : Product can not  be inserted"); }
  const defaultVariationId = await getLastIdAndSet("Variations"); 
  const newDfVariationId = defaultVariationId !== null && defaultVariationId !== undefined ? defaultVariationId : 1;
  let imageFile = await uploadFile(product.image);
  myImageUrl = imageFile.fileUrl;
  const dBDefaultVariation = {id:newDfVariationId,productId:newId,price: product.price,imageUrl: myImageUrl,capacity: product.defaultAttributes.capacity, packaging: product.defaultAttributes.packaging,flavor: product.defaultAttributes.flavor,isDefault:true}
  const dfVariationCanBeInserted = await checkBeforeCRUDExec('Variations', dBDefaultVariation);
  if (dfVariationCanBeInserted[0] === true) {
    try {
      await addToObjectStoreExec('Variations', dBDefaultVariation, null);
      await loadProducts();
      setShowForm(false);
      
    }
    catch (error) {console.error("Default variation can not  be inserted:", error);}
     
    }
    else{console.log("Error : Default variation  be inserted"); }
 
  if(product.hasVariants === true){
    const total = product.variants.length;
    let variants = product.variants;
    let dBVariationId = newDfVariationId +1;
    for (let i = 0; i < total; i++) {
      dBVariationId = dBVariationId+i;
      if(variants[i].image){let imageFile = await uploadFile(variants[i].image);myImageUrl = imageFile.fileUrl;}
      else{myImageUrl =null;}       
      const dBVariation = {id:dBVariationId,productId:newId, price: variants[i].price,imageUrl: myImageUrl,capacity: variants[i].capacity, packaging: variants[i].packaging,flavor: variants[i].flavor,isDefault:false}
      const dbVariationCanBeInserted = await checkBeforeCRUDExec('Variations', dBVariation);
      if (dfVariationCanBeInserted[0] === true) {
    try {
      await addToObjectStoreExec('Variations', dBVariation, null);
      await loadProducts();
      setShowForm(false);
    }
    catch (error) {console.error("Variation can not  be inserted:", error);}
     
    }
    else{console.log("Error : variation  be inserted"); }
     
    }
  }
  }
  const base64ToFile = (base64String, filename) => {
    const byteString = atob(base64String.split(',')[1]);
    const mimeType = base64String.split(',')[0].match(/:(.*?);/)[1];
    const byteNumbers = new Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const file = new File([byteArray], filename, { type: mimeType });

    // Set the image as the product image
    setProduct((prevProduct) => ({
        ...prevProduct,
        image: file,
    }));
    setValidatedPhoto(true);
};
  


  /*const capturePhoto = (forVariantIndex = null) => {
    console.log("index",forVariantIndex);
    const video = videoRef.current;
    const canvas = canvasRef.current;
  
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Convert the captured image to a Blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${Date.now()}.png`, { type: "image/png" });
  
          if (forVariantIndex !== null) {
            // Add the file to the specific variant
            setProduct((prevProduct) => {
              const updatedVariants = prevProduct.variants.map((variant, index) =>
                index === forVariantIndex ? { ...variant, image: file } : variant
              );
              return { ...prevProduct, variants: updatedVariants };
            });
          } else {
            // Add the file as the default product image
            setProduct((prevProduct) => ({ ...prevProduct, image: file }));
          }
  
          // Optionally preview the captured image
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
        }
      }, "image/png");
  
      stopCamera();
    }
  };*/

  const handleEditProduct = (index) => {
    setNewProduct(products[index]);
    setEditIndex(index);
    setIsEditingProduct(true);
    setShowModal(true);
  };
  const findProductById = (productId) => {
    return productList.find((entry) => entry.product.id === productId);
  };

  const handleDeleteProduct = async (productId,variantId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        const myProduct = findProductById(productId);
       if(myProduct.variations.length>1){
        const variationRemoved =await deleteFromObjectStoreExec("Variations",variantId);
        loadProducts();
       }
       else{
        
        const variationRemoved =await deleteFromObjectStoreExec("Variations",1);
        const productRemoved =await deleteFromObjectStoreExec("Products",productId);
        loadProducts();
       }

        if(variantId){

        }
        /*const productToDelete = products[index];
        await deleteFromObjectStoreExec('Products', productToDelete.id);
        setProducts(products.filter((_, i) => i !== index));*/
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  
    /*try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
  
      const result = await response.json();
      return result.imageUrl; // Return the file URL
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }*/
 
  


  

  useEffect(() => {
    const fetchMainBarPermission = async () => {
      try {
        // Fetch data asynchronously
        const mainBarPermission = await getWhereFieldEqualsExec('BarUserPermissions', ["isMainBar"], [true]);
        let myMainBar = null;
        let barId = null;
        // Check if mainBarPermission exists and has a barId
        if (mainBarPermission && mainBarPermission.length > 0) {
          barId = mainBarPermission[0].barId;
          myMainBar = mainBarList.flat().find(bar => bar.uid === barId);
        }
  
        // Set mainBar state if myMainBar is found
        if (myMainBar) {
          setMainBar(myMainBar);
        }
        else{
          const myDefaultBar = barList[0];
          setDefaultBar(myDefaultBar);
        }
      } catch (error) {
        console.error("Error fetching mainBarPermission:", error);
      }
    };
  
    // Call the async function
    fetchMainBarPermission();
  }, [mainBarList, setMainBar]);
  
  // Load data on component mount
  useEffect(() => {
    loadProducts();
  }, []);
  useEffect(() => {
    // Log the updated productList whenever it changes
  }, [productList]); // Dependency array ensures this runs when productList updates

  useEffect(() => {}, [activeInventory]); 
 

  const editVariantImage = async (e,objectStoreName, fieldName, constraints) => {
    
    console.log("----constraints", constraints);
    const file = e.target.files[0];
    if (!file) return;
    if(file){let imageFile = await uploadFile(file);
      myImageUrl = imageFile.fileUrl;

     
      if(myImageUrl){
        const myresults = await setFieldValues(objectStoreName,'id',constraints.id ,  {
          [fieldName]: myImageUrl // Update the specified field with new value
        });
        if(myresults){ await loadProducts();}
    
      }
    }
      else{myImageUrl =null;}  

     

  }

  
  const loadProducts = async () => {
    try {
      const productsFromDb = await getAllObjectStoreDataExec('Products');
      const variationsFromDb =  await getAllObjectStoreDataExec('Variations');
      setProducts(productsFromDb || []);
      setVariationList(variationsFromDb || []);
      myProductList = productsFromDb.map(product => {
        // Filter variations that correspond to the current product
        const correspondingVariations = variationsFromDb.filter(variation => variation.productId === product.id);        return {
        product,variations: correspondingVariations,};});
      if(myProductList){setProductList(myProductList);}
      
    } catch (error) {console.error('Error loading Products:', error);}
  };

  const [currentVariantIndex, setCurrentVariantIndex] = useState({});

  // Function to handle navigation through variations

const handleVariantSlideChange = (productId, totalVariants, direction) => {
  setCurrentVariantIndex((prevState) => {
    const currentIndex = prevState[productId] || 0;
    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % totalVariants
        : (currentIndex - 1 + totalVariants) % totalVariants;

    console.log(`Updated variant index for product ${productId}:`, newIndex);

    // Find the new variant and store it explicitly
    const updatedVariant = productList.find((entry) => entry.product.id === productId)
      ?.variations[newIndex];

    setCurrentVariants((prev) => ({
      ...prev,
      [productId]: updatedVariant
    }));
    // Force a re-render
    setForceRender((prev) => prev + 1);

    return { ...prevState, [productId]: newIndex };
  });
};

  
  const handleEdit = async (objectStoreName, fieldName, newValue, constraints) => {
    const constraintKey= Object.keys(constraints)[0];
    const constraintValue = constraints[constraintKey];
    console.log("handle editing .... " , objectStoreName, fieldName, newValue,constraintKey,constraintValue  );
    try {  
      // Pass `constraints` separately and only send `newValue` as part of `updates`
      const myresults = await setFieldValues(objectStoreName, constraintKey,constraintValue, {
        [fieldName]: newValue // Fix: Properly structure the updates
      });
      await loadProducts();
      console.log("-----editing-------", myresults);
    } catch (error) {
      console.error("Error during editing:", error);
    }
  };
  

  const startCamera = (target,t) => {
    setValidatedPhoto(false);
    const imageHolders = document.querySelectorAll('.imageHoder');
  const parentElement = t.target.closest('.imageHoder');

  // Hide all image holders
  imageHolders.forEach((holder) => {
    holder.style.display = 'none';
  });

  // Show the clicked parent element
  if (parentElement) {
    parentElement.style.display = 'flex';
  }

    setIsCameraOpen((prev) => ({ open: true, target })); // Save the target (null for product, index for variant)
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
      });
  };
  const imageToField = (capturedImage,t) => {
    console.log("-----captured image",capturedImage);
    base64ToFile(capturedImage, "image.png");
    console.log("----product", product);
  }
  const capturePhoto = () => {
    // Check if videoRef.current is defined
    if (!videoRef.current) {
      console.error("Video is not available");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Ensure the video has dimensions before capturing
    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      stopCamera(); // Stop the camera after capturing the photo
    } else {
      console.error("Video dimensions are not ready");
    }
  };
  const stopCamera = () => {
    setIsCameraOpen(false);
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file); // Match the server's expected field name  
      const response = await axios.post('http://localhost:5000/upload', formData, { // Use the correct endpoint
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          console.log(`Upload Progress: ${progress}%`);
        },
      });
  
      console.log("Response Data:", response.data);
      return response.data; // Should include the file URL returned by the server
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error; // Re-throw the error for further handling
    }
  };
 

  const handleStockChange = (productId, variantId, change) => {
    console.log("------handleStockChange : ",productId, variantId, change);
    /*setInventory((prev) => ({
      ...prev,
      [variantId]: {
        productId,
        quantity: Math.max(0, (prev[variantId] || 0) + change), // Prevent negative values
      },
    }));*/
  };

  const handleCountInputChange = (productId, variantId, value) => {
    const numericValue = parseInt(value, 10);
    console.log("------andleCountInputChange : ", numericValue);
    /*if (!isNaN(numericValue)) {
      setInventory((prev) => ({
        ...prev,
        [variantId]: {
          productId,
          quantity: Math.max(0, numericValue), // Prevent negative values
        },
      }));
    }*/
  };


  /*const saveInventoryExec = async () => { 
    /*const updatedInventory = Object.entries(quantities).map(([ productId,variantId, quantity]) => ({
      productId,
      variantId: parseInt(variantId, 10),
      quantity,
    }));
  
    
    const lastId = await getLastIdAndSet("StoreChecks"); 
    const newId = lastId !== null && lastId !== undefined ? lastId : 1;
    let mainBarUid = null;
    let userUid = null;
    let todaysDate = new Date();
    if(mainUser){userUid = mainUser.uid;}    
    if(mainBar && mainBar.length > 0){ mainBarUid =mainBar.uid;}
    else {mainBarUid = defaultBar.uid;}
    const dBInventory = { id:newId, barId:mainBarUid, userId:userUid, checkType:"Check Before sale",checkTime: todaysDate };
    const canBeInserted = await checkBeforeCRUDExec('StoreChecks', dBInventory);
  if (canBeInserted[0] === true) {
  try {
    const myStoreCheckId = await addToObjectStoreExec('StoreChecks', dBInventory, null);
    if(myStoreCheckId){
     
      
      const results = await Promise.all(quantities.map(async (item) => {
       
        const lastId = await getLastIdAndSet("ItemReport"); 
        const newId = lastId !== null && lastId !== undefined ? lastId : 1;        
        console.log(`Product ID: ${item.productId}, Variant ID: ${item.variantId}, Value: ${item.value}, Total: ${item.total}`);
        const dBItem = { id:newId, ref:"StoreCheck",refId:myStoreCheckId,productId:item.productId,variationId:item.variantId,quantity:item.value+1, barId:mainBarUid, priceValue:item.total};
        
        
        console.log("----------------------------------------------------",dBItem);
        const canBeInserted = await checkBeforeCRUDExec('ItemReport', dBItem);
        if (canBeInserted[0] === true) {
          try {
            const myItemReportId = await addToObjectStoreExec('ItemReport', dBItem, null);
          }
          catch (error) {console.error("Product can not  be inserted:", error);}
        }
     
      }));
     
      
    }
  }
  catch (error) {console.error("Product can not  be inserted:", error);}
   
  }
  else{console.log("Error : Product can not  be inserted"); }
  };
  */
  const saveInventoryExec = async () => {
    setInventoryStatus("Saving inventory..."); // Show loading message

      const response = await saveInventory(quantities, mainUser, mainBar, defaultBar, checkBeforeCRUDExec, addToObjectStoreExec, getLastIdAndSet);
      if (response.success) {
        setInventoryStatus(response.message);
        setShowViewInventory(true); // Show the "View Inventory" button
    } else {
        setInventoryStatus(response.message);
        setShowViewInventory(false);
    }


    setReportId(getLastStoreCheckId());
    setActiveInventory(false); // Hide the inventory button after saving
  };

  return (
    <div className="container mt-4">
      <h2>Gestion des Produits et du Stock</h2>
      {/* Button to open the form */}
      <Button variant="primary" className="mb-4" onClick={() => setShowForm(true)}>
      <i className="fas fa-plus"></i> Enregistrer un produit
      </Button>
     
      {Array.isArray(productList) && productList.length > 0 && activeInventory === false ? (<Button variant="primary" className="mb-4" onClick={() => setActiveInventory(true)}>
       <i className="fas fa-clipboard-list"></i> Commencer l'inventaire
      </Button>) : ( <span></span>)}
      



      <Table striped bordered hover>
  <thead>
    <tr>
      <th>Liste des produits</th>
    </tr>
  </thead>
  <tbody>
  {productList.map((entry) => {
  const sortedVariations = entry.variations ? [...entry.variations].sort((a, b) => b.isDefault - a.isDefault) : []; // Handle missing variations
  const productId = entry.product.id;
  const currentIndex = currentVariantIndex[productId] || 0; // Fallback to 0 if undefined
  const currentVariant = currentVariants[productId] || sortedVariations[currentIndex] || {};
  // Fallback to an empty object if no variant exists
  const currentStock = inventory[currentVariant.id] || 0;
  let myVariation = sortedVariations[currentIndex] || {};
   // State to track quantities


      // Update quantity using buttons or input
const updateQuantity = (productId, variantId, value, price) => {
  setQuantities((prev) => {
    console.log("Current state of quantities:", prev);
    const existing = Array.isArray(prev) ? prev.find (
      (item) => item.productId === productId && item.variantId === variantId
    ) : null;
    let updatedQuantities;
    if (existing) {
      updatedQuantities = prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, value: Math.max(0, value), total: Math.max(0, value) * price }
          : item
      );
    } else {
      updatedQuantities = Array.isArray(prev)
        ? [...prev, { productId, variantId, value: Math.max(0, value), total: Math.max(0, value) * price }]
        : [{ productId, variantId, value: Math.max(0, value), total: Math.max(0, value) * price }];
    }

    // Compute total sum of all variants
    const newTotalSum = updatedQuantities.reduce((sum, item) => sum + item.total, 0);
    setTotalSum(newTotalSum);

    return updatedQuantities;
  });
};
      return (
        <tr key={productId}>
          <td>
            {/* Product Name */}
            <div className="productBox">
              <strong>                
               <InlineEditableText initialText={entry.product.name} 
               onSave={(newValue) =>handleEdit('Products','name', newValue,{'id': productId})}
               inputStyle={{ border: "1px dashed green" }}
               saveButtonLabel={<i className="fas fa-save" ></i>}
              cancelButtonLabel={<i className="fas fa-window-close "></i>}/>
              </strong>
              {/* button grid */}

              <div className="button-grid">
      {!activeInventory === true
        && <button className="grid-button green"  onClick={() => setShowForm(true)}><i className="fas fa-plus"></i></button>}
     {!activeInventory === true
        && <button className="grid-button green" onClick={async () => {
          await loadProducts();  // Load products
          setForceRender(prev => prev + 1);  // Force re-render
        }}><i class="fas fa-sync-alt"></i></button>}
    <button 
  className={`grid-button ${Array.isArray(productList) && productList.length > 0 && !activeInventory ? 'green' : 'green big not-show'}`}  
  onClick={() => {
    if (Array.isArray(productList) && productList.length > 0 && !activeInventory) {
      setActiveInventory(true);
    } else {
      saveInventoryExec(); // Call saveInventoryExec when class is "green big"
    }
  }}
>
  <i className={Array.isArray(productList) && productList.length > 0 && !activeInventory 
    ? "fas fa-clipboard-list"  // Show inventory icon if conditions are met
    : "far fa-calendar-check"}  // Show different icon when "green big"
  ></i>
</button>

{!activeInventory === true && <button className="grid-button"><i className="fas fa-sync-alt"></i></button>
&&<button className="grid-button red" onClick={ () => handleDeleteProduct(productId,currentVariant.id)}><i className="fas fa-trash-alt"></i></button>}
{!activeInventory === true && <button className="grid-button grey" onClick={() => handleVariantSlideChange(productId, sortedVariations.length, 'prev')}><i className="fas fa-backward"></i></button>}
{!activeInventory === true &&<button className="grid-button grey" onClick={() =>handleVariantSlideChange(productId, sortedVariations.length,'next')}><i className="fas fa-forward"></i></button>}
    </div>
         
  </div>
 <div className="imgBox">
      <img
        src={currentVariant.imageUrl}
        alt={`${entry.product.name} - ${currentVariant.capacity}`}
        style={{ width: '50px', cursor:"pointer"}}
        onClick={() => document.getElementById(`fileInput-${currentVariant.id}`).click()}
        />
        
    <input
  type="file"
  accept="image/*"
  id={`fileInput-${currentVariant.id}`} // Unique ID for each variant
  style={{ display: 'none' }} // Hidden file input
  ref={fileInputRef}
  onChange={(e) => editVariantImage(
    e, // Pass the event object
    'Variations', // Object store name
    'imageUrl', // Field name to update
    { id: currentVariant.id } // Constraints for the update
  )}
/>
    </div>    <div className="variation-data">
    <div className="variation-item">
          <span>
          
          <span className="label">🍷</span>
         <InlineEditableText initialText={entry.product.category} onSave={(newValue) =>
                  handleEdit(
                    'Products',
                    'category',
                    newValue,
                    { id: productId }
                  )
                }inputStyle={{ border: "1px dashed green" }}
                saveButtonLabel={<i className="fas fa-save" ></i>}
                cancelButtonLabel={<i className="fas fa-window-close "></i>}
              />
         {myVariation.price !== null && myVariation.price !== "" && (
          <><span> | </span>
          <span className="label">💰</span>
         <InlineEditableText key={`price-${forceRender}`} initialText={`${myVariation.price}`}  onSave={(newValue) => handleEdit('Variations','price',newValue,{ id: currentVariant.id })}inputStyle={{ border: "1px dashed green" }} saveButtonLabel={<i className="fas fa-save" ></i>}cancelButtonLabel={<i className="fas fa-window-close "></i>} /><span> Fcfa</span></>)}
         {myVariation.capacity !== null && myVariation.capacity !== "" && ( 
          <><span> | </span>
            <span className="label">📏</span>        
         <InlineEditableText key={`capacity-${forceRender}`} initialText={`${myVariation.capacity}`} onSave={(newValue) => handleEdit('Variations','capacity',newValue,{ id: currentVariant.id })}inputStyle={{ border: "1px dashed green" }} saveButtonLabel={<i className="fas fa-save" ></i>}cancelButtonLabel={<i className="fas fa-window-close "></i>} /><span> cl</span></>)}
         {myVariation.packaging !== null && myVariation.packaging !== "" && ( 
          <><span> | </span> 
          <span className="label">📦</span> 
         <InlineEditableText key={`packaging-${forceRender}`} initialText={`${myVariation.packaging}`} onSave={(newValue) => handleEdit('Variations','packaging',newValue,{ id: currentVariant.id })}inputStyle={{ border: "1px dashed green" }} saveButtonLabel={<i className="fas fa-save" ></i>}cancelButtonLabel={<i className="fas fa-window-close "></i>} /></>)}
         {myVariation.flavor !== null && myVariation.flavor !== "" && ( 
          <><span> | </span>
          <span className="label">🍹</span>          
         <InlineEditableText key={`flavor-${forceRender}`} initialText={`${myVariation.flavor}`} onSave={(newValue) => handleEdit('Variations','flavor',newValue,{ id:currentVariant.id })}inputStyle={{ border: "1px dashed green" }} saveButtonLabel={<i className="fas fa-save" ></i>}cancelButtonLabel={<i className="fas fa-window-close "></i>} /></>)}
         
         </span></div></div>
         {activeInventory && (
  <div className="inventory-controls">
     <button className="btn btn-sm btn-success arrow" onClick={() => handleVariantSlideChange(productId, sortedVariations.length, 'prev')}><i className="fas fa-backward"></i></button>
    <button
      onClick={() => {
        const currentQuantity = Array.isArray(quantities)
          ? quantities.find(
              (item) =>
                item.productId === productId &&
                item.variantId === currentVariant.id
            )?.value || 0
          : 0;

        updateQuantity(productId, currentVariant.id, currentQuantity - 1, myVariation.price);
      }}
      className="btn btn-sm btn-success"
    >
      -
    </button>
    <input
      type="number"
      value={
        Array.isArray(quantities)
          ? quantities.find(
              (item) =>
                item.productId === productId &&
                item.variantId === currentVariant.id
            )?.value || 0
          : 0
      }
      onChange={(e) => {
        const value = parseInt(e.target.value, 10) || 0;
        updateQuantity(productId, currentVariant.id, value, myVariation.price);
      }}
      style={{ width: "60px", margin: "0 10px", textAlign: "center" }}
    />
    <button
      onClick={() => {
        const currentQuantity = Array.isArray(quantities)
          ? quantities.find(
              (item) =>
                item.productId === productId &&
                item.variantId === currentVariant.id
            )?.value || 0
          : 0;

        updateQuantity(productId, currentVariant.id, currentQuantity + 1, myVariation.price);
      }}
      className="btn btn-sm btn-success"
    >
      +
    </button>
    <button  className="btn btn-sm btn-success arrow" onClick={() =>handleVariantSlideChange(productId, sortedVariations.length,'next')}><i className="fas fa-forward"></i></button>

    {/* Show total price for each variant */}
    <p className="total">
    Sous-total :<strong>{" "}
      {(
        (quantities.find((item) => item.variantId === currentVariant.id)?.total || 0)
      ).toFixed(2)}{" "}
      Fcfa</strong>    |     
      Total général : <strong>{totalSum.toFixed(2)} Fcfa</strong>
    </p>
  </div>
)}


  
         
      </td>
    </tr>
  );
})}
  </tbody>
</Table>
{activeInventory ? (
    <Button variant="success" className="mt-4" onClick={saveInventoryExec}>
        Terminer l'inventaire
    </Button>
) : (
    <div>
        {inventoryStatus && <p className={showViewInventory ? "text-success" : "text-danger"}>{inventoryStatus}</p>}
        {showViewInventory && (
            <Button variant="primary" className="mt-2" onClick={() => (alert("inventory here"))}>
                View Inventory
            </Button> 
            &&  <ReportGenerator reportId={reportId} reportType="StockReport" barId={mainBar} userId={mainUser}  action="generate"/>
        )}
        </div>
)}



     
      {/* Modal for the form */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
      <form onSubmit={handleSubmit}>
        {/* Nom du produit */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nom du produit
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Catégorie */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Catégorie du produit
          </label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            
          >
            <option value="">-- Sélectionnez une catégorie --</option>
            <option value="biere">Bière</option>
            <option value="vin">Vin</option>
            <option value="jus">Jus</option>
            <option value="liqueur">Liqueur</option>
          </select>
        </div>

        {/* Prix */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Prix
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </div>


        {/* Image */}
        <div className="mb-3 d-block imageHoder" style={{ display: "block" }}  >
          <label className="form-label">Image du produit</label>
          <div className="d-flex">
            <input
              type="file"
              className="form-control me-2"
              onChange={handleImageChange}
              accept="image/*"
            />
            
          </div>
          

        
  </div>
        
        {/* Attributs par défaut */}
        <h5>Attributs par défaut du produit</h5>
        <div className="mb-3">
          <label htmlFor="defaultCapacity" className="form-label">
            Capacité (en cl)
          </label>
          <input
            type="number"
            className="form-control"
            id="defaultCapacity"
            name="capacity"
            value={product.defaultAttributes.capacity}
            onChange={handleDefaultAttributeChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="defaultPackaging" className="form-label">
            Type d’emballage
          </label>
          <select
            className="form-select"
            id="defaultPackaging"
            name="packaging"
            value={product.defaultAttributes.packaging}
            onChange={handleDefaultAttributeChange}
          >
            <option value="">-- Sélectionnez un type --</option>
            <option value="verre">Bouteille en verre</option>
            <option value="canette">Canette</option>
            <option value="plastique">Plastique</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="defaultFlavor" className="form-label">
            Saveur
          </label>
          <input
            type="text"
            className="form-control"
            id="defaultFlavor"
            name="flavor"
            value={product.defaultAttributes.flavor}
            onChange={handleDefaultAttributeChange}
          />
        </div>

        {/* Gestion des variantes */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="hasVariants"
            checked={product.hasVariants}
            onChange={() => {
              setProduct({
                ...product,
                hasVariants: !product.hasVariants,
                variants: !product.hasVariants
                  ? [
                      {
                        capacity: "",
                        packaging: "",
                        flavor: "",
                        price: "",
                        image: null,
                      },
                    ]
                  : [],
              });
            }}
          />
          <label className="form-check-label" htmlFor="hasVariants">
            Ce produit a des variantes
          </label>
        </div>

        {product.hasVariants &&
          product.variants.map((variant, index) => (
            <div key={index} className="mb-3 border p-2">
              <h5>Variante {index + 1}</h5>
              {/* Capacité */}
              <div className="mb-3">
                <label className="form-label">Capacité (en cl)</label>
                <input
                  type="number"
                  className="form-control"
                  name="capacity"
                  value={variant.capacity}
                  onChange={(e) => handleVariantChange(index, e)}
                 
                />
              </div>

              {/* Type d'emballage */}
              <div className="mb-3">
                <label className="form-label">Type d’emballage</label>
                <select
                  className="form-select"
                  name="packaging"
                  value={variant.packaging}
                  onChange={(e) => handleVariantChange(index, e)}
                  
                >
                  <option value="">-- Sélectionnez un type --</option>
                  <option value="verre">Bouteille en verre</option>
                  <option value="canette">Canette</option>
                  <option value="plastique">Plastique</option>
                </select>
              </div>

              {/* Saveur */}
              <div className="mb-3">
                <label className="form-label">Saveur</label>
                <input
                  type="text"
                  className="form-control"
                  name="flavor"
                  value={variant.flavor}
                  onChange={(e) => handleVariantChange(index, e)}
                  
                />
              </div>

              {/* Prix */}
              <div className="mb-3">
                <label className="form-label">Prix</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>

              {/* Image */}
        <div className="mb-3">
          <label className="form-label">Image de la variante</label>
          <div className="d-flex">
            <input
              type="file"
              className="form-control me-2"
              onChange={(e) => handleVariantImageChange(index, e)}
              accept="image/*"
            />
           

            
          </div>  
        
        </div>
        <div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleRemoveVariant(index)}
        >
          Annuler variante
        </Button>
      </div>

                    </div>
          ))}

        {product.hasVariants && (
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={handleAddVariant}
          >
            Ajouter une autre variante
          </button>
        )}

        {/* Bouton d'enregistrement */}
        <button type="submit" className="btn btn-success">
        <i className="fas fa-plus"></i> Enregistrer le produit
        </button>
      </form>
      </Modal.Body>
      </Modal>
    </div>
  );
};

export default StockManagement;
