import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { getAllData, addItem, updateItem, deleteItem, openDB } from '../database/indexedDB'; // Import IndexedDB functions

const BarManagement = () => {
  const [bars, setBars] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBar, setNewBar] = useState({
    name: '',
    location: '',
    owner: '',
    ownerId: '',
    ownerPhone: '',
    status: '',
    subscriptionExpiration: '',
    lastPaymentCode: '',
    lastPaymentMethod: '',
    numberOfTables: 0,
  });
  const [editIndex, setEditIndex] = useState(null);

  // Fetch data from IndexedDB on component load
  useEffect(() => {
    const fetchData = async () => {
      await openDB();
      
      // Retrieve bars from IndexedDB
      const storedBars = await getAllData('bars');
      if (storedBars.length > 0) {
        setBars(storedBars);
      } else {
        // If bars are in localStorage, move them to IndexedDB
        const localStorageBars = localStorage.getItem('bars');
        if (localStorageBars) {
          const barsFromLocalStorage = JSON.parse(localStorageBars);
          barsFromLocalStorage.forEach(async (bar) => await addItem('bars', bar));
          setBars(barsFromLocalStorage);
          localStorage.removeItem('bars'); // Clear localStorage after transferring data
        }
      }

      // Retrieve users from IndexedDB
      const storedUsers = await getAllData('users');
      if (storedUsers.length > 0) {
        setUsers(storedUsers);
      } else {
        // If users are in localStorage, move them to IndexedDB
        const localStorageUsers = localStorage.getItem('users');
        if (localStorageUsers) {
          const usersFromLocalStorage = JSON.parse(localStorageUsers);
          usersFromLocalStorage.forEach(async (user) => await addItem('users', user));
          setUsers(usersFromLocalStorage);
          localStorage.removeItem('users'); // Clear localStorage after transferring data
        }
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBar({ ...newBar, [name]: value });
  };

  const handleOwnerChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = users.find(user => user.id === parseInt(selectedUserId));
    if (selectedUser) {
      setNewBar({ 
        ...newBar, 
        owner: selectedUser.name, 
        ownerId: selectedUser.id,
        ownerPhone: selectedUser.telephone
      });
    }
  };

  const handleSaveBar = async () => {
    if (editIndex !== null) {
      const updatedBars = [...bars];
      updatedBars[editIndex] = newBar;
      setBars(updatedBars);
      await updateItem('bars', newBar); // Update in IndexedDB
    } else {
      const newBarWithId = { ...newBar, id: bars.length + 1 };
      setBars([...bars, newBarWithId]);
      await addItem('bars', newBarWithId); // Add to IndexedDB
    }

    setNewBar({
      name: '',
      location: '',
      owner: '',
      ownerId: '',
      ownerPhone: '',
      status: '',
      subscriptionExpiration: '',
      lastPaymentCode: '',
      lastPaymentMethod: '',
      numberOfTables: 0,
    });
    setShowModal(false);
  };

  const handleEditBar = (index) => {
    setNewBar(bars[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteBar = async (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bar?')) {
      const barToDelete = bars[index];
      setBars(bars.filter((_, i) => i !== index));
      await deleteItem('bars', barToDelete.id); // Delete from IndexedDB
    }
  };

  const handleAddBar = () => {
    setEditIndex(null);
    setNewBar({
      name: '',
      location: '',
      owner: '',
      ownerId: '',
      ownerPhone: '',
      status: '',
      subscriptionExpiration: '',
      lastPaymentCode: '',
      lastPaymentMethod: '',
      numberOfTables: 0,
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
            <th>Téléphone</th>
            <th>Status</th>
            <th>Expiration de l'abonnement</th>
            <th>Code du dernier paiement</th>
            <th>Méthode du dernier paiement</th>
            <th>Nombre de Tables</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bars.map((bar, index) => (
            <tr key={bar.id}>
              <td>{bar.name}</td>
              <td>{bar.location}</td>
              <td>{bar.owner}</td>
              <td>{bar.ownerPhone}</td>
              <td>{bar.status}</td>
              <td>{bar.subscriptionExpiration}</td>
              <td>{bar.lastPaymentCode}</td>
              <td>{bar.lastPaymentMethod}</td>
              <td>{bar.numberOfTables}</td>
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
              <Form.Select
                name="ownerId"
                value={newBar.ownerId}
                onChange={handleOwnerChange}
                required
              >
                <option value="">Sélectionner un propriétaire</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
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
                <option value="">Sélectionner une méthode</option>
                <option value="Carte de Crédit">Carte de Crédit</option>
                <option value="PayPal">PayPal</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formNumberOfTables" className="mt-3">
              <Form.Label>Nombre de Tables</Form.Label>
              <Form.Control
                type="number"
                name="numberOfTables"
                value={newBar.numberOfTables}
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
          <Button variant="primary" onClick={handleSaveBar}>
            {editIndex !== null ? 'Modifier Bar' : 'Ajouter Bar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BarManagement;
