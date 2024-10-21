import React, { useState, useEffect } from 'react'; 
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { 
    getAllObjectStoreDataExec, 
    addToObjectStoreExec, 
    updateObjectStoreExec, 
    deleteFromObjectStoreExec,
    getLastIdAndSet 
} from '../database/indexedDB'; // Import your updated IndexedDB helper functions

const LocationManagement = () => {
    const [locations, setLocations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newLocation, setNewLocation] = useState({
        country: '',
        state: '',
        town: '',
        area: '',
        region: '',
        postalCode: ''
    });
    const [editIndex, setEditIndex] = useState(null);
    const [editingLocationId, setEditingLocationId] = useState(null); // Store the ID of the location being edited

    // Load locations from IndexedDB on component mount
    useEffect(() => {
        const loadLocations = async () => {
            const locationList = await getAllObjectStoreDataExec('Locations'); // Fetch locations from IndexedDB
            setLocations(locationList);
        };
        loadLocations();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLocation({ ...newLocation, [name]: value });
    };

    const handleSaveLocation = async () => {
        if (editIndex !== null) {
            // Update existing location
            const updatedLocation = { ...newLocation, id: editingLocationId }; // Use the saved ID
            await updateObjectStoreExec('Locations', updatedLocation); // Update location in IndexedDB
            const updatedLocations = [...locations];
            updatedLocations[editIndex] = updatedLocation;
            setLocations(updatedLocations);
        } else {
            const nextId = await getLastIdAndSet('Locations');
            // Add new location
            const newLocationId = await addToObjectStoreExec('Locations', newLocation, nextId); // Add location to IndexedDB and get the new ID
            setLocations([...locations, { ...newLocation, id: newLocationId }]);
        }
        setNewLocation({
            country: '',
            state: '',
            town: '',
            area: '',
            region: '',
            postalCode: ''
        });
        setShowModal(false);
    };

    const handleEditLocation = (index) => {
        setNewLocation(locations[index]);
        setEditIndex(index);
        setEditingLocationId(locations[index].id); // Store the ID for the location being edited
        setShowModal(true);
    };

    const handleDeleteLocation = async (index) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet emplacement ?')) {
            const locationId = locations[index].id;
            await deleteFromObjectStoreExec('Locations', locationId); // Delete location from IndexedDB
            setLocations(locations.filter((_, i) => i !== index));
        }
    };

    const handleAddLocation = async () => {
        setEditIndex(null);
        setNewLocation({
            country: '',
            state: '',
            town: '',
            area: '',
            region: '',
            postalCode: ''
        });
        setShowModal(true);
        // Automatically detect and save location
        await handleGetCurrentLocation(); // Detect location
        
    };

    // LocationIQ API key (replace with your own API key)
    const LOCATIONIQ_API_KEY = 'pk.7f4ae5d2b92a01cd5c88d8a5aa675d46';

    // Function to get address from coordinates using LocationIQ
    async function getAddressFromCoordinates(latitude, longitude) {
        try {
            const response = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Check if we received an address
            if (data && data.address) {
                const address = {
                    country: data.address.country || '',
                    state: data.address.state || '',
                    city: data.address.city || data.address.town || data.address.village || '',
                    suburb: data.address.suburb || '',
                    postalCode: data.address.postcode || '',
                    street: data.address.road || '',
                    fullAddress: data.display_name || ''
                };
                return address;
            } else {
                throw new Error('Address not found.');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            return null; // Return null in case of error
        }
    }

    // Function to get the user's current location
    const handleGetCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Wait for the address to be fetched
                    const myAddress = await getAddressFromCoordinates(latitude, longitude);
                    if (myAddress) {
                        console.log('Full Address:', myAddress.fullAddress);
                        console.log('Detailed Address:', myAddress);
                    } else {
                        console.log('Could not retrieve address.');
                    }

                    console.log("My Address:", myAddress);

                    // Set placeholder values for demonstration
                    setNewLocation({
                        country: myAddress.country || 'Example Country', // Fallback to example if undefined
                        state: myAddress.state || 'Example State', // Fallback to example if undefined
                        town: myAddress.city || 'Example Town', // Fallback to example if undefined
                        area: myAddress.suburb || '', // Placeholder
                        region: '', // Placeholder
                        postalCode: myAddress.postalCode || '' // Fallback if undefined
                    });

                    console.log("Location detected!", latitude, longitude);

                } catch (error) {
                    console.error('Error retrieving the address:', error);
                }
            }, (error) => {
                console.error('Error getting location: ', error);
                alert('Could not retrieve your location. Please enable location services.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestion des Emplacements</h2>
            <Button variant="primary" onClick={handleAddLocation}>
                Ajouter un Emplacement
            </Button>

            <div className="table-responsive mt-3">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Pays</th>
                            <th>État/Province</th>
                            <th>Ville</th>
                            <th>Zone</th>
                            <th>Code Postal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map((location, index) => (
                            <tr key={location.id}>
                                <td>{location.country}</td>
                                <td>{location.state}</td>
                                <td>{location.town}</td>
                                <td>{location.area}</td>
                                <td>{location.postalCode}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEditLocation(index)} className="me-2">
                                        Modifier
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteLocation(index)}>
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
                    <Modal.Title>{editIndex !== null ? 'Modifier Emplacement' : 'Ajouter Emplacement'}</Modal.Title>                    
                </Modal.Header>
                <Modal.Body>                
                    <Form>
                    <p>Vérifier votre adresse avant de valider</p>
                        <Form.Group controlId="formCountry">
                            <Form.Label>Pays</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                value={newLocation.country}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formState" className="mt-3">
                            <Form.Label>État/Province</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={newLocation.state}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTown" className="mt-3">
                            <Form.Label>Ville</Form.Label>
                            <Form.Control
                                type="text"
                                name="town"
                                value={newLocation.town}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formArea" className="mt-3">
                            <Form.Label>Zone</Form.Label>
                            <Form.Control
                                type="text"
                                name="area"
                                value={newLocation.area}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPostalCode" className="mt-3">
                            <Form.Label>Code Postal</Form.Label>
                            <Form.Control
                                type="text"
                                name="postalCode"
                                value={newLocation.postalCode}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSaveLocation}>
                        {editIndex !== null ? 'Mettre à Jour' : 'Ajouter'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LocationManagement;
