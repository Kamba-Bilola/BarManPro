import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const initialBars = [
  {
    id: 1,
    name: 'Bar de la paix',
    location: 'Libreville',
    owner: 'Ted MAYOMBO',
    status: 'Active',
    subscriptionExpiration: '2024-12-31',
    lastPaymentCode: 'PAY123',
    lastPaymentMethod: 'Mobile Money',
  },
  {
    id: 2,
    name: 'Café du Coin',
    location: 'Owendo',
    owner: 'Christian MILENZI',
    status: 'Non-Active',
    subscriptionExpiration: '2023-11-15',
    lastPaymentCode: 'PAY456',
    lastPaymentMethod: 'Credit Card',
  },
  {
    id: 3,
    name: 'Entre Nous Bar',
    location: 'Akanda',
    owner: 'Entre nous',
    status: 'Active',
    subscriptionExpiration: '2024-01-10',
    lastPaymentCode: 'PAY789',
    lastPaymentMethod: 'Cash',
  },
];

const BarManagement = () => {
  const [bars, setBars] = useState(initialBars);
  const [showModal, setShowModal] = useState(false);
  const [newBar, setNewBar] = useState({
    name: '',
    location: '',
    owner: '',
    status: '',
    subscriptionExpiration: '',
    lastPaymentCode: '',
    lastPaymentMethod: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBar({ ...newBar, [name]: value });
  };

  const handleSaveBar = () => {
    if (editIndex !== null) {
      const updatedBars = [...bars];
      updatedBars[editIndex] = newBar;
      setBars(updatedBars);
    } else {
      setBars([...bars, { ...newBar, id: bars.length + 1 }]);
    }
    setNewBar({
      name: '',
      location: '',
      owner: '',
      status: '',
      subscriptionExpiration: '',
      lastPaymentCode: '',
      lastPaymentMethod: '',
    });
    setShowModal(false);
  };

  const handleEditBar = (index) => {
    setNewBar(bars[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteBar = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bar?')) {
      setBars(bars.filter((_, i) => i !== index));
    }
  };

  const handleAddBar = () => {
    setEditIndex(null);
    setNewBar({
      name: '',
      location: '',
      owner: '',
      status: '',
      subscriptionExpiration: '',
      lastPaymentCode: '',
      lastPaymentMethod: '',
    });
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Gestion des Bars</h2>
      <Button variant="primary" onClick={handleAddBar}>
        Ajouter un Bar
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nom du Bar</th>
            <th>Localisation</th>
            <th>Propriétaire</th>
            <th>Status</th>
            <th>Expiration de l'abonnement</th>
            <th>Code du dernier paiement</th>
            <th>Méthode du dernier paiement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bars.map((bar, index) => (
            <tr key={bar.id}>
              <td>{bar.name}</td>
              <td>{bar.location}</td>
              <td>{bar.owner}</td>
              <td>{bar.status}</td>
              <td>{bar.subscriptionExpiration}</td>
              <td>{bar.lastPaymentCode}</td>
              <td>{bar.lastPaymentMethod}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditBar(index)} className="me-2">
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDeleteBar(index)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Modifier Bar' : 'Ajouter Bar'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Nom du Bar</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newBar.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLocation" className="mt-3">
              <Form.Label>Localisation</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newBar.location}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formOwner" className="mt-3">
              <Form.Label>Propriétaire</Form.Label>
              <Form.Control
                type="text"
                name="owner"
                value={newBar.owner}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStatus" className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={newBar.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner le status</option>
                <option value="Active">Active</option>
                <option value="Non-Active">Non-Active</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formSubscriptionExpiration" className="mt-3">
              <Form.Label>Date d'expiration de l'abonnement</Form.Label>
              <Form.Control
                type="date"
                name="subscriptionExpiration"
                value={newBar.subscriptionExpiration}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastPaymentCode" className="mt-3">
              <Form.Label>Code du dernier paiement</Form.Label>
              <Form.Control
                type="text"
                name="lastPaymentCode"
                value={newBar.lastPaymentCode}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastPaymentMethod" className="mt-3">
              <Form.Label>Méthode du dernier paiement</Form.Label>
              <Form.Select
                name="lastPaymentMethod"
                value={newBar.lastPaymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner la méthode</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveBar}>
            {editIndex !== null ? 'Modifier Bar' : 'Ajouter Bar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BarManagement;
