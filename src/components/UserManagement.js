import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { getAllObjectStoreDataExec, getObjectStoreDataExec, addToObjectStoreExec, updateObjectStoreExec, deleteFromObjectStoreExec } from '../database/indexedDB'; // Import your updated IndexedDB helper functions

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        uid: '',
        displayName: '',
        photoURL: '',
        email: '',
        createdAt: '',
        lastLoginAt: '',
        barControled: '',
        fullName: '',
        phone: '',
        password: '',
        role: '',
        Subscription: ''
    });
    const [editIndex, setEditIndex] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null); // Store the ID of the user being edited

    // Load users from IndexedDB on component mount
    useEffect(() => {
        const loadUsers = async () => {
            console.log("loading users ... ");
            const userList = await getAllObjectStoreDataExec('Users'); // Fetch users from IndexedDB
            setUsers(userList);
            console.log("loading users ... ", userList);
        };
        loadUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSaveUser = async () => {
        if (editIndex !== null) {
            // Update existing user
            const updatedUser = { ...newUser, uid: editingUserId }; // Use the saved ID
            await updateObjectStoreExec('Users', updatedUser); // Update user in IndexedDB
            const updatedUsers = [...users];
            updatedUsers[editIndex] = updatedUser;
            setUsers(updatedUsers);
        } else {
            // Add new user
            const newUserId = await addToObjectStoreExec('Users', newUser); // Add user to IndexedDB and get the new ID
            setUsers([...users, { ...newUser, uid: newUserId }]);
        }
        setNewUser({
            uid: '',
            displayName: '',
            photoURL: '',
            email: '',
            createdAt: '',
            lastLoginAt: '',
            barControled: '',
            fullName: '',
            phone: '',
            password: '',
            role: '',
            Subscription: ''
        });
        setShowModal(false);
    };

    const handleEditUser = (index) => {
        setNewUser(users[index]);
        setEditIndex(index);
        setEditingUserId(users[index].uid); // Store the ID for the user being edited
        setShowModal(true);
    };

    const handleDeleteUser = async (index) => {
        if (window.confirm('Êtes vous sûr de vouloir supprimer cet utilisateur?')) {
            const userId = users[index].uid;
            await deleteFromObjectStoreExec('Users', userId); // Delete user from IndexedDB
            setUsers(users.filter((_, i) => i !== index));
        }
    };

    const handleAddUser = () => {
        setEditIndex(null);
        setNewUser({
            uid: '',
            displayName: '',
            photoURL: '',
            email: '',
            createdAt: '',
            lastLoginAt: '',
            barControled: '',
            fullName: '',
            phone: '',
            password: '',
            role: '',
            Subscription: ''
        });
        setShowModal(true);
    };

    return (
        <div className="container mt-4">
            <h2>Gestion des utilisateurs</h2>
            <Button variant="primary" onClick={handleAddUser}>
                Créer un utilisateur
            </Button>

            <div className="table-responsive mt-3"> {/* Make table responsive */}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nom Complet</th>
                            <th>Nom d'affichage</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Bar Contrôlé</th>
                            <th>Dernière Connexion</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.uid}>
                                <td>{user.fullName}</td>
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.barControled}</td>
                                <td>{user.lastLoginAt}</td>
                                <td>{user.role}</td>
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
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editIndex !== null ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFullName">
                            <Form.Label>Nom Complet</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={newUser.fullName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDisplayName" className="mt-3">
                            <Form.Label>Nom d'affichage</Form.Label>
                            <Form.Control
                                type="text"
                                name="displayName"
                                value={newUser.displayName}
                                onChange={handleInputChange}
                                required
                            />
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
                                name="phone"
                                value={newUser.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBarControlled" className="mt-3">
                            <Form.Label>Bar Contrôlé</Form.Label>
                            <Form.Control
                                type="text"
                                name="barControled"
                                value={newUser.barControled}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRole" className="mt-3">
                            <Form.Label>Rôle</Form.Label>
                            <Form.Select
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Sélectionner Rôle</option>
                                <option value="SuperAdmin">SuperAdmin</option>
                                <option value="Bartender">Bartender</option>
                                <option value="BarOwner">BarOwner</option>
                            </Form.Select>
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
