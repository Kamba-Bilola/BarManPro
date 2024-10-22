import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Spinner } from 'react-bootstrap';
import { 
    getAllObjectStoreDataExec, 
    addToObjectStoreExec, 
    updateObjectStoreExec, 
    deleteFromObjectStoreExec, 
    getObjectStoreDataExec,
    getLastIdAndSet,getWhereFieldEqualsExec,setFieldValues} from '../database/indexedDB'; 
import { syncDataWithFirestore } from '../database/syncFromFirestore'; // Import the sync function
import BarOwner from './BarOwner'; // Import the new BarOwner component
import BarTender from './BarTender'; // Import BarTender component
import {checkBeforeCRUDExec} from "../database/verification.js"
import {myFirestoreDb} from "../database/firebase";
import { collection, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const BarManagement = ({ role, syncStatus, setSyncStatus, handleSync  }) => {
    const [bars, setBars] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isBarForm, setIsBarForm] = useState(false); // To control which form is shown
    const [loadingLocation, setLoadingLocation] = useState(false); // To manage loading state for location
    const[ownerPassword, setOwnerPassword] = useState(null);
    const [newBar, setNewBar] = useState({
        id: '',
        uid: '',
        name: '',
        location: '',
        ownerUid: '',
        status: 'inactive',
        subscriptionExpiration: '',
        lastPaymentCode: '',
        lastPaymentMethod: '',
        numberOfTables: '',
        totalSales: '',
        totalGap: '',
        subscriptionLevel: 'Ordinary'
    });
    const [editIndex, setEditIndex] = useState(null);
    const [editingBarId, setEditingBarId] = useState(null);
    let myPermis = null;
// Define state for searchQuery and filterTables
const [searchQuery, setSearchQuery] = useState('');
const [filterTables, setFilterTables] = useState('');
const [userPermissonData, setUserPermissonData] = useState(null); // State to store selected bar ID
const [isMainBar, setIsMainBar] = useState(false);
const [newUserPermission, setNewUserPermission] = useState({
    id: null,
    barId: null,
    userId: null,
    canUpdateSales: true,
    canUpdateStock: true,
    grantedBy: true,
    grantedAt: null,
    isMainBar: null
});

    const [newLocation, setNewLocation] = useState({
        country: '',
        state: '',
        town: '',
        area: '',
        region: '',
        postalCode: ''
    });

    
    const [ownerPhone, setOwnerPhone] = useState(''); // Owner phone input
    const [password, setPassword] = useState(''); // Password input
    const [filterName, setFilterName] = useState(''); // Filter by name
    const [filterLocation, setFilterLocation] = useState(''); // Filter by location
    const [error, setError] = useState(null); // Error tracking
    const [notification, setNotification] = useState();
    const [mainUser, setmainUser] = useState();
    let mainUserUid = null;

    // Load bars from IndexedDB on component mount
    useEffect(() => {
        const loadBars = async () => {
            const barList = await getAllObjectStoreDataExec('Bars'); 
            setBars(barList);
        };
        loadBars();
    }, [bars, newBar]);

    // Autofill ownerUid with mainUserUid from session
    useEffect(() => {
        const loadMainUserUid = async () => {
            const loginSession = await getObjectStoreDataExec('Sessions', 1);
            mainUserUid = loginSession.userId;
            setNewBar((prevState) => ({ ...prevState, ownerUid: mainUserUid }));
        };
        loadMainUserUid();
    }, []);
    const loadingMainUserUid = async () => {
        const loginSession = await getObjectStoreDataExec('Sessions', 1);
        mainUserUid = loginSession.userId;
        return mainUserUid;
    };
   
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBar({ ...newBar, [name]: value });
    };

    const handleLocationInputChange = (e) => {
        const { name, value } = e.target;
        setNewLocation({ ...newLocation, [name]: value });
    };

    const buildPermissionData= async () =>{
        // Get the last ID and set the new ID accordingly for BarUserPermissions
        const lastId = await getLastIdAndSet("BarUserPermissions");
        const newId = lastId !== null && lastId !== undefined ? lastId : 1;

        // Load the main user UID and set permission details
        const mainUserUid = await loadingMainUserUid();
        const currentDate = new Date();
        myPermis = {id:newId, userId:mainUserUid, barId: bartenderFormData.uid, grantedBy: bartenderFormData.ownerUid, grantedAt: currentDate, isMainBar: true  }
    }
    const handleSaveBar = async () => {
        if (editIndex !== null) {
            await updateObjectStoreExec('Bars', newBar.id, newBar);
            const updatedBar = newBar;
            const updatedBars = [...bars];
            updatedBars[editIndex] = updatedBar;
            const mainUserUid = await loadingMainUserUid();
            const recordToChange = await getWhereFieldEqualsExec('BarUserPermissions', ["userId","barId"], [mainUserUid,updatedBar.id]);
            const updateIsMainBar= recordToChange[0].isMainBar;
            
            if(updateIsMainBar!==isMainBar)
            {
                if(isMainBar===true){
                await setFieldValues('BarUserPermissions','isMainBar',true,{ isMainBar: false});           
                //update an existing permission
                const myUpdatedPermId=recordToChange[0].id;
                if(myUpdatedPermId){await setFieldValues('BarUserPermissions','id',myUpdatedPermId,{ isMainBar: true}); }
                else{setNotification({ type: 'error', messages: ["Error handling bar association"]});}
                    
                }
            }
            
            return;
            //setBars(updatedBars);
        } else {
            try {
                const lastId = await getLastIdAndSet("Bars");
                const newId = lastId !== null && lastId !== undefined ? lastId : 1;
                const newUID = uuidv4();
                const mainUserUid = await loadingMainUserUid();
    
                const barWithId = { 
                    ...newBar, 
                    id: newId, 
                    uid: newUID, 
                    ownerUid: mainUserUid 
                };
    
                const result = await checkBeforeCRUDExec('Bars', barWithId);
    
                if (result[0] === true) {
                    try {
                        // Add the bar to IndexedDB
                        await addToObjectStoreExec('Bars', barWithId, null);
                        setBars((prevBars) => [...prevBars, barWithId]);
                        const ownerUid = mainUserUid;
                        const barUid = barWithId.uid;
                        const theMainUser = await getObjectStoreDataExec('Users', mainUserUid);
    
                        if (!theMainUser) {
                            setNotification({
                                type: 'error',
                                messages: ["Owner not found in the database"]
                            });
                            return;
                        }
    
                        // Create full `newUserPermission` object
                        const currentDate = new Date();
                        const lastPermissionId = await getLastIdAndSet("BarUserPermissions");
                        const newPermissionId = lastPermissionId !== null && lastPermissionId !== undefined ? lastPermissionId : 1;
    
                        const newUserPermission = {
                            id: newPermissionId,
                            userId: ownerUid, // Required field: ID de l'utilisateur
                            barId: barUid,    // Required field: Bar UID
                            grantedBy: ownerUid,  // Required field: Accordé à (granted by)
                            grantedAt: currentDate,
                            isMainBar: isMainBar
                        };
    
                        // Check for existing permissions
                        const permissionCheckResult = await checkBeforeCRUDExec('BarUserPermissions', newUserPermission);
    
                        if (permissionCheckResult[0] === true) {
                            await setFieldValues('BarUserPermissions','isMainBar',true,{ isMainBar: false}); 
                            const permissionGranted = await addToObjectStoreExec('BarUserPermissions', newUserPermission, null);
                            if (permissionGranted) {
                                setNotification({
                                    type: 'success',
                                    messages: ["Permission granted successfully"]
                                });
                            } else {
                                setNotification({
                                    type: 'error',
                                    messages: ["Failed to grant permission"]
                                });
                            }
                        } else {
                            setNotification({
                                type: 'error',
                                messages: permissionCheckResult.slice(1)
                            });
                        }
                    } catch (error) {
                        console.error("Error handling bar association:", error);
                        setNotification({
                            type: 'error',
                            messages: ["An error occurred while processing your request. Please try again."]
                        });
                    }
                } else {
                    setNotification({
                        type: 'error',
                        messages: result.slice(1)
                    });
                }
            } catch (error) {
                console.log('Failed to add new bar:', error);
                setNotification({
                    type: 'error',
                    messages: ['Failed to add new bar', error.message]
                });
            }
        }
    
        resetBarForm();
        setShowModal(false);
    };
    
    

    const handleSaveLocation = async () => {
        // Save the location and switch to bar form with location pre-filled
        const fullAddress = `${newLocation.area}, ${newLocation.town}, ${newLocation.state}, ${newLocation.country}`;
        setNewBar({ ...newBar, location: fullAddress }); // Pre-fill bar location with the full address

        // Proceed to show the bar creation form
        setIsBarForm(true);
    };

    const handleAddBar = () => {
        setEditIndex(null);
        resetBarForm();
        setShowModal(true);
        setIsBarForm(true); // Show bar form directly if clicked
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
        setIsBarForm(false); // Show location form first
        await handleGetCurrentLocation(); // Detect location
    };

    const resetBarForm = () => {
        setNewBar({
            name: '',
            location: '',
            ownerUid: '',
            uid:'',
            status: 'inactive',
            subscriptionExpiration: '',
            lastPaymentCode: '',
            lastPaymentMethod: '',
            numberOfTables: '',
            totalSales: '',
            totalGap: '',
            subscriptionLevel: 'Ordinary'
        });
        setEditIndex(null);
        setEditingBarId(null);
    };

    // Function to get the user's current location
    const handleGetCurrentLocation = async () => {
        setLoadingLocation(true); // Set loading state
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

                    // Set detected location
                    setNewLocation({
                        country: myAddress.country || 'Example Country',
                        state: myAddress.state || 'Example State',
                        town: myAddress.city || 'Example Town',
                        area: myAddress.suburb || '',
                        region: '',
                        postalCode: myAddress.postalCode || ''
                    });
                    setLoadingLocation(false); // Stop loading once address is detected

                } catch (error) {
                    console.error('Error retrieving the address:', error);
                    setLoadingLocation(false); // Stop loading on error
                }
            }, (error) => {
                console.error('Error getting location: ', error);
                alert('Could not retrieve your location. Please enable location services.');
                setLoadingLocation(false); // Stop loading on error
            });
        } else {
            alert('Geolocation is not supported by this browser.');
            setLoadingLocation(false); // Stop loading if geolocation is not supported
        }
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

    async function handleDeleteBar (barId){
        console.log(barId);
        try {
            await deleteFromObjectStoreExec('Bars', barId);
            console.log(`Bar with ID ${barId} deleted successfully`);
            
            // Assuming you have state for bars, update it to remove the deleted bar
            setBars((prevBars) => prevBars.filter((bar) => bar.id !== barId));
        } catch (error) {
            console.error('Error deleting bar:', error);
        }
    }


// Function to handle new sync trigger


// Function to filter the bars based on user input
   // Filtering logic
   const filteredBars = bars.filter(bar => {
    const matchesSearch = bar.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bar.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTableFilter = filterTables === '' || 
                               (filterTables === '1-5' && bar.numberOfTables <= 5) ||
                               (filterTables === '6-10' && bar.numberOfTables >= 6 && bar.numberOfTables <= 10) ||
                               (filterTables === '11+' && bar.numberOfTables >= 11);
    return matchesSearch && matchesTableFilter;
});

// Handle bar association (for bartender)
const handleAssociateBar = async (e) => {
    e.preventDefault();

    // Check if a bar is selected
    const selectedBar = bartenderFormData.selectedBar;
    
    if (!selectedBar) 
    {setNotification({type: 'warning',messages: ["Select a bar from the table below"]});return;} 

    try {
        // Extract the owner's UID from the selected bar
        const ownerUid = bartenderFormData.ownerUid;
        const barUid = bartenderFormData.uid;
        if (!ownerUid){setNotification({type: 'error',messages: ["Owner UID is missing"]}); return;}
        if (!barUid) {setNotification({type: 'error', messages: ["Bar UID is missing"]});return;}

        const ownerCollection = collection(myFirestoreDb, "Users"); // Specify your collection
        const ownerSnapshot = await getDocs(ownerCollection); // Fetch documents
        const ownerList = ownerSnapshot.docs.map(doc => doc.data()); // Map to data
        
        // Find the owner with the matching UID
        const owner = ownerList.find((owner) => owner.uid === ownerUid);
        if (!owner) {setNotification({ type: 'error', messages: ["Owner not found in the database"]}); return;}

       
        // Compare phone and password values
        const { ownerPhone, ownerPassword } = bartenderFormData;
        if (ownerPhone !== owner.phone || ownerPassword !== owner.password) {
        setNotification({ type: 'error',messages: ["Owner's phone and password do not match, try again"]}); return;}

        // Get the last ID and set the new ID accordingly for BarUserPermissions
        const lastId = await getLastIdAndSet("BarUserPermissions");
        const newId = lastId !== null && lastId !== undefined ? lastId : 1;

        // Load the main user UID and set permission details
        const mainUserUid = await loadingMainUserUid();
        const currentDate = new Date();
        myPermis = {id:newId, userId:mainUserUid, barId: bartenderFormData.uid, grantedBy: bartenderFormData.ownerUid, grantedAt: currentDate, isMainBar: true  }
        await setPermissions(myPermis);
        
    } catch (error) {setNotification({ type: 'error',messages: [error]});}
};

const setPermissions = async(myPermis)=>{
   let recordToChange=null;
   let allPermissions =null;
   let isNewPermission = null;
   let noPermission = null;
   let allFalse = null;
   let checker = null;
   let recordExists = null;
   let result = null;

   if(myPermis.id && myPermis.barId){ 
   //checking what to do
    try{
        recordToChange = await getWhereFieldEqualsExec('BarUserPermissions', ["userId","barId"], [myPermis.userId,myPermis.barId]);
        allPermissions = await getAllObjectStoreDataExec('BarUserPermissions');
    }catch{}
    if(allPermissions){
        noPermission=false;
        // Check if recordToChange is in allPermissions
        recordExists = allPermissions.some(permission =>permission.userId === recordToChange.userId && permission.barId === recordToChange.barId);
        if(recordExists){isNewPermission=false;}
        else{isNewPermission=true;}
    } 
    else{ noPermission=true;} 


    const insertNewPermission = async()=>{
        checker = await checkBeforeCRUDExec('BarUserPermissions', myPermis);
        if(checker[0]!==false){ result= await addToObjectStoreExec('BarUserPermissions', myPermis, null); }
        else{setNotification({ type: 'error',messages: checker.slice(1)});}
    }

    
    //no permissions yet
    if(noPermission===true){ await insertNewPermission();}
    else{
        allFalse = setFieldValues('BarUserPermissions','isMainBar',true,{ isMainBar: false});
        //permissions exist but this is a new one
        if(isNewPermission===true){
        if(!allFalse){setNotification({type: 'Error', messages: ["All false not set successfully"]})}
        else{await insertNewPermission();}
        }
        else{            
        //update an existing permission
        myPermis.id=recordToChange[0].id;
        if(myPermis.id){result= updateObjectStoreExec('BarUserPermissions', myPermis.id, myPermis);}
        else{setNotification({ type: 'error', messages: ["Error handling bar association"]});}
        }
    }  }
    else{setNotification({ type: 'error', messages: ["Data Error handling bar association"]});}
     
}

const [bartenderFormData, setBartenderFormData] = useState({
    selectedBar: null,      // For storing selected bar ID
    barName: '',          // For storing selected bar's name
    uid:'',
    barLocation: '',      // For storing selected bar's location
    barTables: '',        // For storing selected bar's number of tables
    ownerPhone: '',       // For storing owner's phone number
    ownerPassword: '',     // For storing owner's password
    isMainBar: true
});
// Handle input changes for bartender form
const handleBarTenderInputChange = (e, formType, bar) => {
    const { name, value, type } = e.target;
   
    // Check if the input type is a radio for selecting the bar
    if (type === "radio" && name === "selectedBar") {
        console.log(" ----bar ...: ",  bar);
        // Update the selected bar ID and its associated details in the state
        setBartenderFormData({
            ...bartenderFormData,
            selectedBar: bar.id,    // Bar ID
            uid: bar.uid,
            barName: bar.name,      // Bar name
            barLocation: bar.location,    // Bar location
            barTables: bar.numberOfTables,   // Number of tables in the bar
            ownerUid: bar.ownerUid,
            isMainBar:true
        });
    }

    // Handle changes for ownerPhone and ownerPassword fields
    switch (name) {
        case "ownerPhone":
            setBartenderFormData({ ...bartenderFormData, ownerPhone: value });
            break;
        case "ownerPassword":
            setBartenderFormData({ ...bartenderFormData, ownerPassword: value });
            break;
        default:
            break;
    }
    console.log(" ----bartenderFormData ...: ",  bartenderFormData);
    
};

const handleEditBar = (index) => {   
    const barToUpdate = bars[index];
    setEditIndex(index);
    setNewBar(barToUpdate);
    setNewBar({ ...newBar, id: barToUpdate.id,location: barToUpdate.location, name: barToUpdate.name, numberOfTables: barToUpdate.numberOfTables}); // Pre-fill bar location with the full address
    setIsBarForm(true);
    setShowModal(true);
};

const handleMainBarRadioChange = (e) => {
    const value = e.target.value === 'true'; // Convert string 'true'/'false' to boolean
    setIsMainBar(value); // Set the local state
};

    return (
        <div className="container mt-4">
            {role === 'BarOwner' && (<BarOwner
                    bars={bars}
                    setBars={setBars}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    isBarForm={isBarForm}
                    editIndex={editIndex}
                    newBar={newBar}
                    handleInputChange={handleInputChange}
                    handleSaveBar={handleSaveBar}
                    handleEditBar={handleEditBar}
                    handleDeleteBar={handleDeleteBar}
                    handleAddLocation={handleAddLocation}
                    newLocation={newLocation}
                    handleLocationInputChange={handleLocationInputChange}
                    handleSaveLocation={handleSaveLocation}
                    loadingLocation={loadingLocation}
                    notification={notification}
                    setNotification={setNotification}
                    isMainBar={isMainBar}
                    setIsMainBar={setIsMainBar}
                    handleMainBarRadioChange={handleMainBarRadioChange}
                />)}
            {role === "Bartender" && !bars && (<div><p>Problem Technique Bars Introuvables</p></div>) }
            {role === "Bartender" && bars !== undefined && (<BarTender
                    syncStatus={syncStatus}
                    error={error}
                    bars={bars}
                    filteredBars={filteredBars}
                    bartenderFormData={bartenderFormData}
                    searchQuery={searchQuery}
                    filterTables={filterTables}
                    handleBarTenderInputChange={handleBarTenderInputChange}
                    handleAssociateBar={handleAssociateBar}
                    setSearchQuery={setSearchQuery}
                    setFilterTables={setFilterTables}
                    notification={notification}
                    isMainBar={isMainBar}
                    setIsMainBar={setIsMainBar}
                    handleMainBarRadioChange={handleMainBarRadioChange}
                /> )}

        </div>
    )
};

export default BarManagement;
