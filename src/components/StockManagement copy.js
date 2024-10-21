import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const initialStock = [
  { id: 1, barName: 'Bar de la paix', itemName: 'Beer', quantity: 100, costPrice: 1200, sellingPrice: 1500 },
  { id: 2, barName: 'Café du Coin', itemName: 'Whiskey', quantity: 50, costPrice: 5000, sellingPrice: 6000 },
  { id: 3, barName: 'Entre Nous Bar', itemName: 'Soda', quantity: 200, costPrice: 500, sellingPrice: 800 },
];

const StockManagement = () => {
  const [stock, setStock] = useState(initialStock);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    barName: '',
    itemName: '',
    quantity: '',
    costPrice: '',
    sellingPrice: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
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
      barName: '',
      itemName: '',
      quantity: '',
      costPrice: '',
      sellingPrice: '',
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
      barName: '',
      itemName: '',
      quantity: '',
      costPrice: '',
      sellingPrice: '',
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
            <th>Nom du Bar</th>
            <th>Nom de l'Article</th>
            <th>Quantité</th>
            <th>Prix d'Achat</th>
            <th>Prix de Vente</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item, index) => (
            <tr key={item.id}>
              <td>{item.barName}</td>
              <td>{item.itemName}</td>
              <td>{item.quantity}</td>
              <td>{item.costPrice}</td>
              <td>{item.sellingPrice}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditItem(index)} className="me-2">
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDeleteItem(index)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Modifier Article' : 'Ajouter Article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBarName">
              <Form.Label>Nom du Bar</Form.Label>
              <Form.Control
                type="text"
                name="barName"
                value={newItem.barName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formItemName" className="mt-3">
              <Form.Label>Nom de l'Article</Form.Label>
              <Form.Control
                type="text"
                name="itemName"
                value={newItem.itemName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formQuantity" className="mt-3">
              <Form.Label>Quantité</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCostPrice" className="mt-3">
              <Form.Label>Prix d'Achat</Form.Label>
              <Form.Control
                type="number"
                name="costPrice"
                value={newItem.costPrice}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSellingPrice" className="mt-3">
              <Form.Label>Prix de Vente</Form.Label>
              <Form.Control
                type="number"
                name="sellingPrice"
                value={newItem.sellingPrice}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
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
