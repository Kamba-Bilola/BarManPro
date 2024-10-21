import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { getObjectStoreDataExec, updateObjectStoreExec } from '../database/indexedDB';
import { useDispatch } from 'react-redux';
import { setUserState } from '../redux/slices/globalStateSlice';

const IncompleteProfile = () => {
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ fullName: '', role: '', email: '', phone: '', password: '', repeatPassword: '', Subscription: '' });
    const [editIndex, setEditIndex] = useState(null);
    const [mainUser, setMainUser] = useState(null);
    const [sessionStatus, setSessionStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    
    const dispatch = useDispatch();
    let  myMainUserUid = null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const validateForm = () => {
        let errors = {};

        // Check if all required fields are filled
        if (!newUser.fullName && !mainUser?.displayName) {
            errors.name = "Nom Complet est requis.";
        }
        if (!newUser.phone) {
            errors.phone = "Téléphone est requis.";
        }
        if (!newUser.role) {
            errors.role = "Role est requis.";
        }
        if (!newUser.Subscription) {
            errors.Subscription = "Type de Souscription est requis.";
        }
        if (!newUser.email && !mainUser?.email) {
            errors.email = "Email est requis.";
        }
        if (!newUser.password) {
            errors.password = "PIN est requis.";
        }
        if (newUser.password.length !== 4) {
            errors.password = "PIN doit être exactement 4 chiffres.";
        }
        if (newUser.password !== newUser.repeatPassword) {
            errors.password = "Les mots de passe ne correspondent pas.";
            errors.repeatPassword = "Les mots de passe ne correspondent pas.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSaveUser = async () => {
        if (!validateForm()) {
            return;
        }
      
        try {
            if (mainUser) {
                const updatedUser = { 
                    ...mainUser, 
                    fullName: newUser.fullName || mainUser.displayName, 
                    role: newUser.role, 
                    email: newUser.email || mainUser.email, 
                    phone: newUser.phone, 
                    password: newUser.password, 
                    Subscription: newUser.Subscription 
                };
                
                await updateObjectStoreExec("Users", myMainUserUid, updatedUser);
                console.log("User data updated successfully in IndexedDB.");
                
                // Update the Redux state to indicate the profile is complete
                dispatch(setUserState("complete"));
            }
        } catch (error) {
            console.error("Error updating user data in IndexedDB:", error);
        }
    };

    useEffect(() => {
        const loadSessionUserData = async () => {
            try {
                // Get login session
                const loginSession = await getObjectStoreDataExec("Sessions", 1);
                console.log("loginSession : ", loginSession);
                const mainUserUid = loginSession.userId;
                myMainUserUid = mainUserUid;
                const sessionStatus = loginSession.status;
                console.log("User ID:", mainUserUid, "Session Status:", sessionStatus);

                // Get main user data
                const mainUser = await getObjectStoreDataExec("Users", mainUserUid);
                console.log("mainUser : ", mainUser);

                // Set states
                setMainUser(mainUser);
                setNewUser({
                    uid:mainUserUid,
                    fullame: mainUser.displayName || '',
                    role: mainUser.role || '',
                    email: mainUser.email || '',
                    phone: mainUser.phone || '',
                    password: '',
                    repeatPassword: '',
                    Subscription: mainUser.Subscription || '',
                });
                setSessionStatus(sessionStatus);
            } catch (err) {
                console.error("Error loading session or user data:", err);
                setError("Failed to load session or user data");
            } finally {
                setLoading(false);
            }
        };

        loadSessionUserData();
    }, []);

    return (
        <div className="container mt-4">
             <Form>
                <Form.Group controlId="formName">
                    <Form.Label>Nom Complet</Form.Label>
                    <Form.Control
                        type="text"
                        name="fullName"
                        value={newUser.fullName}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!formErrors.fullName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.fullName}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formphone" className="mt-3">
                    <Form.Label>Téléphone</Form.Label>
                    <Form.Control
                        type="tel"
                        name="phone"
                        value={newUser.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Entrez votre numéro de téléphone"
                        pattern="[0-9]{10}"  // Adjust the pattern as per your requirement
                        isInvalid={!!formErrors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.phone}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formRole" className="mt-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                        name="role"
                        value={newUser.role}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!formErrors.role}
                    >
                        <option value="">Sélectionner Role</option>
                        <option value="Bartender">Bar Man</option>
                        <option value="BarOwner">Propriétaire</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {formErrors.role}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formSubscription" className="mt-3">
                    <Form.Label>Type de Souscription</Form.Label>
                    <Form.Select
                        name="Subscription"
                        value={newUser.Subscription}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!formErrors.Subscription}
                    >
                        <option value="">Sélectionner le Type de Souscription</option>
                        <option value="Ordynary">Ordinaire</option>
                        <option value="Premium">Premium</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {formErrors.Subscription}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>PIN (4 chiffres)</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        maxLength="4"
                        minLength="4"
                        pattern="\d{4}"  // Updated to ensure 4 digits
                        required
                        isInvalid={!!formErrors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formPasswordRepeat" className="mt-3">
                    <Form.Label>Répéter votre PIN</Form.Label>
                    <Form.Control
                        type="password"
                        name="repeatPassword"
                        value={newUser.repeatPassword}
                        onChange={handleInputChange}
                        maxLength="4"
                        minLength="4"
                        pattern="\d{4}"  // Updated to ensure 4 digits
                        required
                        isInvalid={!!formErrors.repeatPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.repeatPassword}
                    </Form.Control.Feedback>
                </Form.Group>

                <footer>
                    <Form.Group>
                        <Button variant="primary" onClick={handleSaveUser}>{editIndex !== null ? 'Soumettre' : 'Soumettre'}</Button>
                    </Form.Group>
                </footer>
            </Form>

            {error && (
                <Alert variant="danger" className="mt-3">
                    {error}
                </Alert>
            )}
        </div>
    );
};

export default IncompleteProfile;
