import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import AlertNotification from '../specific/AlertNotification';

const BarOwner = ({
    barList,
    setBarList,
    showModal,
    setShowModal,
    isBarForm,
    editIndex,
    newBar,
    handleInputChange,
    handleSaveBar,
    handleEditBar,
    handleDeleteBar,
    handleAddLocation,
    newLocation,
    handleLocationInputChange,
    handleSaveLocation,
    loadingLocation,
    notification,
    setNotification,
    isMainBar,
    setIsMainBar,
    handleMainBarRadioChange
}) => {
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (notification?.type === 'success' || notification?.type === 'error') {
            setShowMessage(true);
            if (notification.type === 'success') {
                setBarList((prevList) => [...prevList, newBar]);
                setShowModal(false);
            }
        } else {
            setShowMessage(false);
        }
    }, [notification, newBar, setBarList, setShowModal]);

    const handleSaveBarWithUpdate = () => {
        handleSaveBar();
        setShowModal(false);
        setUpdateTrigger((prev) => !prev);

        if (notification && (notification.type === 'success' || notification.type === 'error')) {
            setShowMessage(true);
        } else {
            setShowMessage(false);
        }
    };

    return (
        <div className="BarOwner">
            <h3 className="text-primary mb-3">Gestion des Bars</h3>

            {showMessage && (
                <AlertNotification
                    type={notification.type}
                    messages={notification.messages}
                    className="mb-3"
                />
            )}

            <Button variant="primary" onClick={handleAddLocation} className="w-100 mb-4 big-middle">
                Enregistrer un Bar
            </Button>

            <div className="table-responsive">
                <Table striped bordered hover size="sm" className="text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>Nom</th>
                            <th>Emplacement</th>
                            <th>Statut</th>
                            <th>Niveau d'abonnement</th>
                            <th>Nombre de Tables</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {barList.map((bar, index) => (
                            <tr key={bar.id}>
                                <td>{bar.name}</td>
                                <td>{bar.location}</td>
                                <td>{bar.status}</td>
                                <td>{bar.subscriptionLevel}</td>
                                <td>{bar.numberOfTables}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEditBar(index)}
                                        className="me-2"
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteBar(bar.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {editIndex !== null
                            ? 'Modifier un Bar'
                            : isBarForm
                            ? 'Enregistrer un Bar'
                            : 'Enregistrer Emplacement'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingLocation && !isBarForm ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Votre adresse est en cours de téléchargement...</p>
                        </div>
                    ) : (
                        <Form>
                            <p className="fw-bold mb-3">Veuillez vérifier votre adresse avant de continuer</p>
                            {isBarForm ? (
                                <>
                                    {showMessage && (
                                        <AlertNotification
                                            type={notification.type}
                                            messages={notification.messages}
                                            className="mb-3"
                                        />
                                    )}
                                    <Form.Group controlId="bar.name">
                                        <Form.Label>Nom du Bar</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={newBar.name}
                                            onChange={handleInputChange}
                                            className="mb-3"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="bar.location">
                                        <Form.Label>Emplacement</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="location"
                                            value={newBar.location}
                                            onChange={handleInputChange}
                                            className="mb-3"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="bar.subscriptionLevel">
                                        <Form.Label>Niveau d'abonnement</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="subscriptionLevel"
                                            value={newBar.subscriptionLevel}
                                            onChange={handleInputChange}
                                            className="mb-3"
                                        >
                                            <option value="Ordinary">Ordinaire</option>
                                            <option value="Premium">Premium</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="bar.numberOfTables">
                                        <Form.Label>Nombre de Tables</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="numberOfTables"
                                            value={newBar.numberOfTables}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="mb-3"
                                        />
                                    </Form.Group>
                                </>
                            ) : (
                                <>
                                    <Form.Group controlId="location.country">
                                        <Form.Label>Pays</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="country"
                                            value={newLocation.country}
                                            onChange={handleLocationInputChange}
                                            className="mb-3"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="location.state">
                                        <Form.Label>État</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="state"
                                            value={newLocation.state}
                                            onChange={handleLocationInputChange}
                                            className="mb-3"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="location.town">
                                        <Form.Label>Ville</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="town"
                                            value={newLocation.town}
                                            onChange={handleLocationInputChange}
                                            className="mb-3"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="location.area">
                                        <Form.Label>Zone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="area"
                                            value={newLocation.area}
                                            onChange={handleLocationInputChange}
                                            className="mb-3"
                                        />
                                    </Form.Group>
                                </>
                            )}
                            <Button
                                variant="primary"
                                onClick={isBarForm ? handleSaveBarWithUpdate : handleSaveLocation}
                                className="w-100 mt-3 big-middle"
                            >
                                Sauvegarder {isBarForm ? "le Bar" : "l'Emplacement"}
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BarOwner;
