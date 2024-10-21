import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const initialUsers = [
    { id: 1, name: 'Ted MAYOMBO', role: 'SuperAdmin', email: 'kambabilolamays@gmail.com', telephone: '077329495', password: '' },
    { id: 2, name: 'Christian MILENZI', role: 'Bartender', email: 'jane@example.com', telephone: '077349495', password: '' },
    { id: 3, name: 'Entre nous', role: 'BarOwner', email: 'jane@example.com', telephone: '077339495', password: '' },
];

const UserManagement = () => {
    const [users, setUsers] = useState(() => {
        // Load users from localStorage or fall back to initialUsers
        const storedUsers = localStorage.getItem('users');
        return storedUsers ? JSON.parse(storedUsers) : initialUsers;
    });
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', role: '', email: '', telephone: '', password: '' });
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        // Save users to localStorage whenever users state changes
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSaveUser = () => {
        if (editIndex !== null) {
            const updatedUsers = [...users];
            updatedUsers[editIndex] = newUser;
            setUsers(updatedUsers);
        } else {
            setUsers([...users, { ...newUser, id: users.length + 1 }]);
        }
        setNewUser({ name: '', role: '', email: '', telephone: '', password: '' });
        setShowModal(false);
    };

    const handleEditUser = (index) => {
        setNewUser(users[index]);
        setEditIndex(index);
        setShowModal(true);
    };

    const handleDeleteUser = (index) => {
        if (window.confirm('Êtes vous sûr de vouloir supprimer cet utilisateur?')) {
            setUsers(users.filter((_, i) => i !== index));
        }
    };

    const handleAddUser = () => {
        setEditIndex(null);
        setNewUser({ name: '', role: '', email: '', telephone: '', password: '' });
        setShowModal(true);
    };

    return (
        <div className="container mt-4">
            <h2>Gestion des utilisateurs</h2>
            <Button variant="primary" onClick={handleAddUser}>
                Créer un utilisateur
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>{user.email}</td>
                            <td>{user.telephone}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEditUser(index)} className="me-2">
                                    Modifier
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteUser(index)}>
                                    Supprimer
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editIndex !== null ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formRole" className="mt-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Sélectionner Role</option>
                                <option value="SuperAdmin">SuperAdmin</option>
                                <option value="Bartender">Bartender</option>
                                <option value="BarOwner">BarOwner</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTelephone" className="mt-3">
                            <Form.Label>Téléphone</Form.Label>
                            <Form.Control
                                type="text"
                                name="telephone"
                                value={newUser.telephone}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Mot de Passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSaveUser}>
                        {editIndex !== null ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;
