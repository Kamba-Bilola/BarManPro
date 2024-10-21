// src/components/BarTable.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const BarTable = ({ table, onClientAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [clientId, setClientId] = useState('');

  // Retrieve table data from localStorage when the component mounts
  useEffect(() => {
    const storedTables = JSON.parse(localStorage.getItem('tables'));
    if (storedTables) {
      onClientAdded(storedTables);
    }
  }, [onClientAdded]);

  const handleAddClient = () => {
    const newClient = { id: clientId };
    const updatedTable = {
      ...table,
      clients: [...table.clients, newClient],
    };

    // Update the local storage
    const storedTables = JSON.parse(localStorage.getItem('tables')) || [];
    const updatedTables = storedTables.map((t) => (t.id === table.id ? updatedTable : t));

    localStorage.setItem('tables', JSON.stringify(updatedTables));
    onClientAdded(updatedTables);

    setClientId('');
    setShowModal(false);
  };

  return (
    <div className="bar-table">
      <h4>Table {table.id}</h4>
      <ul>
        {table.clients.map((client) => (
          <li key={client.id}>Client {client.id}</li>
        ))}
      </ul>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Client
      </Button>

      {/* Modal for adding clients */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Client to Table {table.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formClientId">
              <Form.Label>Client ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddClient}>
            Add Client
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BarTable;
