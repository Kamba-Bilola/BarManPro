import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

// Retrieve items from local storage or use an empty array if none exist
const getInitialStock = () => {
  const savedStock = localStorage.getItem('stock');
  return savedStock ? JSON.parse(savedStock) : [];
};

const StockManagement = () => {
  const [stock, setStock] = useState(getInitialStock);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    sizes: [{ size: '', price: '', image: '' }],
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    // Update local storage whenever stock changes
    localStorage.setItem('stock', JSON.stringify(stock));
  }, [stock]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSizeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSizes = [...newItem.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [name]: value };
    setNewItem({ ...newItem, sizes: updatedSizes });
  };

  const handleAddSize = () => {
    setNewItem({
      ...newItem,
      sizes: [...newItem.sizes, { size: '', price: '', image: '' }],
    });
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = newItem.sizes.filter((_, i) => i !== index);
    setNewItem({ ...newItem, sizes: updatedSizes });
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const updatedSizes = [...newItem.sizes];
      updatedSizes[index] = { ...updatedSizes[index], image: reader.result };
      setNewItem({ ...newItem, sizes: updatedSizes });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = () => {
    if (editIndex !== null) {
      const updatedStock = [...stock];
      updatedStock[editIndex] = newItem;
      setStock(updatedStock);
    } else {
      setStock([...stock, { ...newItem, id: stock.length + 1 }]);
    }
    setNewItem({
      name: '',
      sizes: [{ size: '', price: '', image: '' }],
    });
    setShowModal(false);
  };

  const handleEditItem = (index) => {
    setNewItem(stock[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteItem = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article?')) {
      setStock(stock.filter((_, i) => i !== index));
    }
  };

  const handleAddItem = () => {
    setEditIndex(null);
    setNewItem({
      name: '',
      sizes: [{ size: '', price: '', image: '' }],
    });
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Gestion des Stocks</h2>
      <Button variant="primary" onClick={handleAddItem}>
        Ajouter un Article
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nom de l'Article</th>
            <th>Taille</th>
            <th>Prix</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.length > 0 ? (
            stock.map((item, index) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  {item.sizes && item.sizes.length > 0
                    ? item.sizes.map((size, idx) => (
                        <div key={idx}>{size.size}</div>
                      ))
                    : 'N/A'}
                </td>
                <td>
                  {item.sizes && item.sizes.length > 0
                    ? item.sizes.map((size, idx) => (
                        <div key={idx}>{size.price}</div>
                      ))
                    : 'N/A'}
                </td>
                <td>
                  {item.sizes && item.sizes.length > 0
                    ? item.sizes.map((size, idx) => (
                        <img
                          key={idx}
                          src={size.image}
                          alt="Item"
                          style={{ width: '50px', height: '50px' }}
                        />
                      ))
                    : 'N/A'}
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEditItem(index)}
                    className="me-2"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteItem(index)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Aucun article disponible.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Modifier Article' : 'Ajouter Article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formItemName">
              <Form.Label>Nom de l'Article</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            {newItem.sizes.map((size, index) => (
              <div key={index} className="mt-3">
                <Form.Group controlId={`formSize${index}`}>
                  <Form.Label>Taille</Form.Label>
                  <Form.Control
                    type="text"
                    name="size"
                    value={size.size}
                    onChange={(e) => handleSizeChange(index, e)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId={`formPrice${index}`} className="mt-3">
                  <Form.Label>Prix</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={size.price}
                    onChange={(e) => handleSizeChange(index, e)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId={`formImage${index}`} className="mt-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    required
                  />
                  {size.image && (
                    <img
                      src={size.image}
                      alt="Preview"
                      style={{ width: '100px', height: '100px', marginTop: '10px' }}
                    />
                  )}
                </Form.Group>
                <Button variant="danger" className="mt-3" onClick={() => handleRemoveSize(index)}>
                  Supprimer cette Taille
                </Button>
              </div>
            ))}
            <Button variant="secondary" className="mt-3" onClick={handleAddSize}>
              Ajouter une Taille
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveItem}>
            {editIndex !== null ? 'Modifier Article' : 'Ajouter Article'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StockManagement;
