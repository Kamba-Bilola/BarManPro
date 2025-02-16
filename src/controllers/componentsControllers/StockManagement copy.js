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


const StockManagement = () => {
  let myImageUrl = null;
  const [progress, setProgress] = useState({started:false,pc:0});
  const [msg, setMsg] = useState(null);
  let myMainBar = null;
  let  barId = null;
  const { mainUser,barList,mainBarList, mainBar, setMainBar,defaultBar,setDefaultBar } = useGlobalState();
  const [showForm, setShowForm] = useState(false);
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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await  builddBProduct(product);
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
  
      console.log(`Updated variant index for product ${productId}:`, newIndex); // Debug log
      return { ...prevState, [productId]: newIndex };
    });
  };
  
  
  const handleEdit = async (objectStoreName, fieldName, newValue, constraints) => {
    try {  
      // Assuming `constraints` includes a field and value for filtering
      const myresults = await setFieldValues(objectStoreName, constraints.field, constraints.value, {
        [fieldName]: newValue, // Update the specified field with new value
      });
  
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
  
  return (
    <div className="container mt-4">
      <h2>Ajouter un Produit</h2>
      {/* Button to open the form */}
      <Button variant="primary" className="mb-4" onClick={() => setShowForm(true)}>
        Enregistrer un produit
      </Button>



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
  const currentVariant = sortedVariations[currentIndex] || {}; // Fallback to an empty object if no variant exists


      

      return (
        <tr key={productId}>
          <td>
            {/* Product Name */}
            <div className="productBox">
              <strong>
                
                <InlineEditableText initialText={entry.product.name} onSave={(newValue) =>
                    handleEdit(
                      'Products', // Table name
                      'name', // Field name
                      newValue, // Current value
                      { id: productId } // Constraints
                    )
                  }inputStyle={{ border: "1px dashed green" }}
                  saveButtonLabel={<i className="fas fa-save" ></i>}
                  cancelButtonLabel={<i className="fas fa-window-close "></i>}
                />
              </strong>
              <Button className="removeProduct alert" variant="primary" size="sm" onClick={ () => handleDeleteProduct(productId,currentVariant.id)}><i className="fas fa-trash-alt"></i></Button>
             
            </div>

            {/* Product Image */}
            <img
              src={currentVariant.imageUrl}
              alt={`${entry.product.name} - ${currentVariant.capacity}`}
              style={{ width: '50px' }}
            />

            {/* Product Category */}
            <div>
           <br/>
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
              <span>  |  </span>
            {/* Variant Details */}
            
            <InlineEditableText initialText= {`${currentVariant.capacity}`}
              onSave={(newValue) =>
                  handleEdit(
                    'Variations',
                    'capacity',
                    newValue,
                    { id: currentVariant.id }
                  )
                }inputStyle={{ border: "1px dashed green" }}
                saveButtonLabel={<i className="fas fa-save" ></i>}
                cancelButtonLabel={<i className="fas fa-window-close "></i>}
              /> <span> cl |  </span>
              <InlineEditableText initialText={currentVariant.price} onSave={(newValue) =>
                  handleEdit(
                    'Variations',
                    'price',
                    newValue,
                    { id: currentVariant.id }
                  )
                }inputStyle={{ border: "1px dashed green" }}
                saveButtonLabel={<i className="fas fa-save" ></i>}
                cancelButtonLabel={<i className="fas fa-window-close "></i>}
              /> <span> Fcfa  |  </span>
              <InlineEditableText initialText={currentVariant.packaging}
             onSave={(newValue) =>
                  handleEdit(
                    'Variations',
                    'packaging',
                    newValue,
                    { id: currentVariant.id }
                  )
                } inputStyle={{ border: "1px dashed green" }}
                saveButtonLabel={<i className="fas fa-save" ></i>}
                cancelButtonLabel={<i className="fas fa-window-close "></i>}
              /> 
            
            </div>

         {/* Variant Navigation */}
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={() =>
              handleVariantSlideChange(productId, sortedVariations.length, 'prev')
            }
          >
            Previous
          </button>
          <button
            onClick={() =>
              handleVariantSlideChange(productId, sortedVariations.length, 'next')
            }
            style={{ marginLeft: '10px' }}
          >
            Next
          </button>
        </div>
      </td>
    </tr>
  );
})}
  </tbody>
</Table>


      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Détails</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{product.name} {product.category} {product.price}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditProduct(index)} className="me-2">
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
            { <button
              type="button"
              className="btn btn-secondary"
              onClick={(t) => startCamera(null,t)}
            >
              <img src={cameraSvg} alt="Utiliser la caméra"  width={25}/>
            </button>}
          </div>
          {validatedPhoto && <p>Photo Validée</p>}
          {capturedImage && !validatedPhoto && (
            <div className="mt-3">
              <p>Image capturée :</p>
              <img
                src={capturedImage}
                alt="Produit capturé"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <div className="mt-3">
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={(t) => imageToField(capturedImage,t)}
              >
                Valider la photo
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={stopCamera}
              >
                Annuler
              </button>
              </div>
            </div>
            
            
            
          ) }
      

        {isCameraOpen.open && (
          <div className="mt-3">
            <video ref={videoRef} style={{ maxWidth: "100%" }}></video>
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={capturePhoto}
              >
                Capturer la photo
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={stopCamera}
              >
                Annuler
              </button>
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>
        )}
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
            { <button
              type="button"
              className="btn btn-secondary"
              onClick={(t) => startCamera(null, t)}
            >
              <img src={cameraSvg} alt="Utiliser la caméra"  width={25}/>
            </button>}

            
          </div>  
          {capturedImage && (
            <div className="mt-3">
              <p>Image capturée :</p>
              <img
                src={capturedImage}
                alt="Produit capturé"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <div className="mt-3">
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={capturePhoto}
              >
                Valider la photo
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={stopCamera}
              >
                Annuler
              </button>
              </div>
            </div>
            
            
            
          ) }
          {isCameraOpen.open && (
          <div className="mt-3">
            <video ref={videoRef} style={{ maxWidth: "100%" }}></video>
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={capturePhoto}
              >
                Capturer la photo
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={stopCamera}
              >
                Annuler
              </button>
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>
        )}        
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
          Enregistrer le produit
        </button>
      </form>
      </Modal.Body>
      </Modal>
    </div>
  );
};

export default StockManagement;
