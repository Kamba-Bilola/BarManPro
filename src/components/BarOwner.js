import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import AlertNotification from './AlertNotification';
const BarOwner = ({
    bars,
    setBars,
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
    let type ; let messages;


     // Show notification when the notification type is either 'success' or 'error'
     useEffect(() => {
        if (notification?.type === 'success' || notification?.type === 'error') {
            setShowMessage(true);
            if(notification.type=='success'){ setBars([...bars, newBar]); setShowModal(false);}
        } else {
            setShowMessage(false);
        }
    }, [notification]);
    // Modify handleSaveBar to force update
    const handleSaveBarWithUpdate = () => {
        handleSaveBar(); // Call the original handleSaveBar function
       /* setUpdateTrigger(prev => !prev); // Toggle the updateTrigger state to force re-render
        if(notification && notification.length > 0){
        if((notification.type=='success') || (notification.type=='error')){
            setShowMessage(true);
            
        }
        else{setShowMessage(null);}}*/

    };
    return (
        <div className="BarOwner">
            <h2>Gestion des Bars</h2>
            {showMessage && (
                <AlertNotification
                    type={notification.type} 
                    messages={notification.messages} 
                />
            )}
            <Button variant="primary" onClick={handleAddLocation}>
                Enregistrer un Bar
            </Button>

            <div className="table-responsive mt-3">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Emplacement</th>
                            <th>Statut</th>
                            <th>Niveau d'abonnement</th>
                            <th>Nombre de Tables</th> {/* New column for Number of Tables */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bars.map((bar, index) => (
                            <tr key={bar.id}>
                                <td>{bar.name}</td>
                                <td>{bar.location}</td>
                                <td>{bar.status}</td>
                                <td>{bar.subscriptionLevel}</td>
                                <td>{bar.numberOfTables}</td> {/* Display Number of Tables */}
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

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editIndex !== null
                            ? 'Modifier un Bar'
                            : isBarForm
                            ? 'Enregistrer un Bar'
                            : 'Enregistrer Emplacement'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!isBarForm ? (
                        loadingLocation ? (
                            <div>
                                <Spinner animation="border" variant="primary" />
                                <p className="text-center mt-3">
                                    Votre adresse est en cours de téléchargement...
                                </p>
                            </div>
                        ) : (
                            <Form>
                                <p><strong>Veuillez vérifier votre adress avant de continuer</strong></p>
                                <Form.Group controlId="location.country">
                                    <Form.Label>Pays</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="country"
                                        value={newLocation.country}
                                        onChange={handleLocationInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="location.state">
                                    <Form.Label>État</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={newLocation.state}
                                        onChange={handleLocationInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="location.town">
                                    <Form.Label>Ville</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="town"
                                        value={newLocation.town}
                                        onChange={handleLocationInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="location.area">
                                    <Form.Label>Zone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="area"
                                        value={newLocation.area}
                                        onChange={handleLocationInputChange}
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    onClick={handleSaveLocation}
                                    className="mt-3"
                                >
                                    Sauvegarder l'Emplacement
                                </Button>
                            </Form>
                        )
                    ) : (
                        <Form>
                           {showMessage && (
                <AlertNotification 
                    type={notification.type} 
                    messages={notification.messages} 
                />
            )}
                         {isBarForm &&
                    <Form.Group>
                        <Form.Label>Est-ce que c'est le bar principal?</Form.Label>
                        <div>
                            <Form.Check
                                type="radio"
                                label="Oui"
                                name="isMainBar"
                                value={true}
                                checked={isMainBar === true}
                                onChange={handleMainBarRadioChange}
                            />
                            <Form.Check
                                type="radio"
                                label="Non"
                                name="isMainBar"
                                value={false}
                                checked={isMainBar === false}
                                onChange={handleMainBarRadioChange}
                            />
                        </div>
                    </Form.Group>}
                    <Form.Group controlId="bar.name">
                                <Form.Label>Nom du Bar</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={newBar.name}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="bar.location">
                                <Form.Label>Emplacement</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    value={newBar.location}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="bar.ownerUid" className="d-none">
                                <Form.Control
                                    type="text"
                                    name="ownerUid"
                                    value={newBar.ownerUid}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group controlId="bar.status">
                                <Form.Label>Statut</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="status"
                                    value={newBar.status}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group controlId="bar.subscriptionLevel">
                                <Form.Label>Niveau d'abonnement</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="subscriptionLevel"
                                    value={newBar.subscriptionLevel}
                                    onChange={handleInputChange}
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
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                onClick={handleSaveBarWithUpdate}
                                className="mt-3"
                            >
                                Sauvegarder le Bar
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
