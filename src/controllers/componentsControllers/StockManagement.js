import React, { useState, useRef, useEffect } from "react";
import cameraSvg from '../../assets/svg/photo-camera.svg';
import uploadSvg from '../../assets/svg/upload.svg';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { getAllObjectStoreDataExec, addToObjectStoreExec,updateObjectStoreExec,deleteFromObjectStoreExec,getObjectStoreDataExec,getLastIdAndSet,getWhereFieldEqualsExec,setFieldValues } from '../databaseControllers/indexedDbCrud';
import { useGlobalState } from "../../states/GlobalStateContext";
const StockManagement = () => {
  const { mainUser,barList,mainBarList, mainBar, setMainBar } = useGlobalState();
  const [showForm, setShowForm] = useState(false);
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
 let dBProduct= {
    id: null,
    name: "",
    category: "",
    price: "",
    image: null,
    capacity: null,
    packaging: null,
    flavor: null
    };
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
  

  
  
  const builddBProduct = async (product) => { 

    console.log(" product :  ", product);  
  const lastId = await getLastIdAndSet("Products"); 
  const newId = lastId !== null && lastId !== undefined ? lastId : 1;
  dBProduct = { id:newId, name:product.name,category: product.category};
  const defaultVariationId = await getLastIdAndSet("Variations"); 
  const newDfVariationId = defaultVariationId !== null && defaultVariationId !== undefined ? defaultVariationId : 1;
  const dBDefaultVarition = {id:newDfVariationId,productId:newId,price: product.price,imageUrl: product.image,capacity: product.defaultAttributes.capacity, packaging: product.defaultAttributes.packaging,flavor: product.defaultAttributes.flavor}
  console.log("---------------");
  console.log("mainBarList  : ",mainBarList);
  console.log("barList",barList);
  console.log("role", mainUser.role);
  console.log("dBProduct" ,dBProduct,  newId);
  console.log("---------------");
  console.log("dBDefaultVarition" ,dBDefaultVarition);
  if(product.hasVariants === true){
    const total = product.variants.length;
    let variants = product.variants;
    let dBVariationId = newDfVariationId +1;
    for (let i = 0; i < total; i++) {
      dBVariationId = dBVariationId+i;
      const dBVarition = {id:dBVariationId,productId:newId, price: variants[i].price,imageUrl: variants[i].image,capacity: variants[i].capacity, packaging: variants[i].packaging,flavor: variants[i].flavor}
      console.log("---------------");
      console.log("variants" ,dBVarition);
    }
  }
  }
  
  const startCamera = (target) => {
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
  
  const capturePhoto = (forVariantIndex = null) => {
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
  const handleEditProduct = (index) => {
    setNewProduct(products[index]);
    setEditIndex(index);
    setIsEditingProduct(true);
    setShowModal(true);
  };

  const handleDeleteProduct = async (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        const productToDelete = products[index];
        await deleteFromObjectStoreExec('Products', productToDelete.id);
        setProducts(products.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
 
  // Load data on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllObjectStoreDataExec('Products');
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading Products:', error);
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
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
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
        <div className="mb-3">
          <label className="form-label">Image du produit</label>
          <div className="d-flex">
            <input
              type="file"
              className="form-control me-2"
              onChange={handleImageChange}
              accept="image/*"
            />
            { /*<button
              type="button"
              className="btn btn-secondary"
              onClick={() => startCamera(null)}
            >
              <img src={cameraSvg} alt="Utiliser la caméra"  width={25}/>
            </button>*/}
          </div>
          {/*capturedImage && (
            <div className="mt-3">
              <p>Image capturée :</p>
              <img
                src={capturedImage}
                alt="Produit capturé"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          ) */}
        </div>

        {/*isCameraOpen && (
          <div className="mt-3">
            <video ref={videoRef} style={{ maxWidth: "100%" }}></video>
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={capturePhoto(null)}
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
        )*/}

        
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
