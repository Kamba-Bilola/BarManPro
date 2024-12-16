import React, { useState, useEffect,useContext } from 'react';
import { Modal, Button, Form, Table, Spinner } from 'react-bootstrap';
import { getAllObjectStoreDataExec, addToObjectStoreExec,updateObjectStoreExec,deleteFromObjectStoreExec,getObjectStoreDataExec,getLastIdAndSet,getWhereFieldEqualsExec,setFieldValues } from '../databaseControllers/indexedDbCrud';
import { syncDataWithFirestore } from '../databaseControllers/syncFromFirestore';
import BarOwner from '../../components/common/BarOwner';
import BarTender from '../../components/common/BarTender';
import { checkBeforeCRUDExec } from '../databaseControllers/verification';
import { myFirestoreDb } from '../databaseControllers/firebase';
import { collection,getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { loadMainBarListExec } from '../../components/specific/DevOpsControls';
import { useGlobalState } from '../../states/GlobalStateContext';
import { comparePassword } from '../utilitiesControllers/passwordUtils';

const BarManagement = ({ role, syncStatus, setSyncStatus, handleSync  }) => {
const { mainBar,setMainBar, mainBarList,setMainBarList,barList, setBarList } = useGlobalState();
const [showModal, setShowModal] = useState(false);
const [isBarForm, setIsBarForm] = useState(false); 
const [loadingLocation, setLoadingLocation] = useState(false); 
const[ownerPassword, setOwnerPassword] = useState(null);
const [newBar, setNewBar] = useState({id: '',uid: '',name: '',location: '',ownerUid: '',status: 'inactive',subscriptionExpiration: '',lastPaymentCode: '',lastPaymentMethod: '',numberOfTables: '',totalSales: '',totalGap: '',subscriptionLevel: 'Ordinary'});
const [editIndex, setEditIndex] = useState(null);
const [editingBarId, setEditingBarId] = useState(null);
let myPermis = null;
const [searchQuery, setSearchQuery] = useState('');
const [filterTables, setFilterTables] = useState('');
const [userPermissonData, setUserPermissonData] = useState(null); // State to store selected bar ID
const [isMainBar, setIsMainBar] = useState(false);
const [newUserPermission, setNewUserPermission] = useState({id: null,barId: null,userId: null,canUpdateSales: true,canUpdateStock: true,grantedBy: true,grantedAt: null,isMainBar: null});
const [newLocation, setNewLocation] = useState({ country: '',state: '',town: '',area: '',region: '',postalCode: ''});
const [ownerPhone, setOwnerPhone] = useState(''); // Owner phone input
const [password, setPassword] = useState(''); // Password input
const [filterName, setFilterName] = useState(''); // Filter by name
const [filterLocation, setFilterLocation] = useState(''); // Filter by location
const [error, setError] = useState(null); // Error tracking
const [notification, setNotification] = useState();
const [mainUser, setmainUser] = useState();
let mainUserUid = null;



    useEffect(() => {
        const loadBars = async () => {
          const fetchedBarList = await getAllObjectStoreDataExec('Bars');
          if (JSON.stringify(fetchedBarList) !== JSON.stringify(barList)) {
            setBarList(fetchedBarList);
          }
        };
      
        loadBars();
      }, [barList]);

      // Optional: Add a separate `useEffect` to log changes to `barList`


useEffect(() => {const loadMainUserUid = async () => {const loginSession = await getObjectStoreDataExec('Sessions', 1);mainUserUid = loginSession.userId;setNewBar((prevState) => ({ ...prevState, ownerUid: mainUserUid }));};loadMainUserUid(); }, []);

useEffect(() => {const loadMainBars= async () => {const fetchedMainBarList = await getAllObjectStoreDataExec('BarUserPermissions');  if (JSON.stringify(fetchedMainBarList) !== JSON.stringify(mainBarList)) {
    setMainBarList(mainBarList);
  }};

loadMainBars();  }, []);

const loadingMainUserUid = async () => {const loginSession = await getObjectStoreDataExec('Sessions', 1);mainUserUid = loginSession.userId;return mainUserUid;};

const handleInputChange = (e) => {const { name, value } = e.target;setNewBar({ ...newBar, [name]: value });};

const handleLocationInputChange = (e) => {const { name, value } = e.target;setNewLocation({ ...newLocation, [name]: value });};

const handleSaveBar = async () => {
//edit bar
if (editIndex !== null) {
try {await updateObjectStoreExec('Bars', newBar.id, newBar);const updatedBars = [...barList];updatedBars[editIndex] = newBar;setBarList(updatedBars);} 
catch (error) {console.error('Error updating bar:', error);setNotification({type: 'error',messages: ["Failed to update bar", error.message]});return;}
try {
const mainUserUid = await loadingMainUserUid();
if (!mainUserUid) { setNotification({ type: 'error', messages: ["Error getting the main user details"] });return;}
        
const currentDate = new Date();
let recordToChange = null;
let myPermis = null;

try {
recordToChange = await getWhereFieldEqualsExec('BarUserPermissions', ["userId", "barId"], [mainUserUid, newBar.uid]);

if (recordToChange && recordToChange.length > 0) {
// Update the permission details
myPermis = {id: recordToChange[0].id,userId: mainUserUid,barId: newBar.uid,grantedBy: newBar.ownerUid,grantedAt: currentDate,isMainBar: isMainBar};
 // Update the permissions in the database

await setPermissions(myPermis);
setNotification({ type: 'success', messages: ["Bar and permissions updated successfully"] });} 
else {
    // If no permission record is found
setNotification({ type: 'error', messages: ["No permission record found for this user and bar"] });}} catch (error) { console.error('Error updating permissions:', error);setNotification({ type: 'error', messages: ["Failed to update permissions", error.message] });}} catch (error) {console.error('Error loading main user:', error);
setNotification({ type: 'error', messages: ["Failed to load main user", error.message] });}
}

//new bar
else {
   
try { const lastId = await getLastIdAndSet("Bars"); const newId = lastId !== null && lastId !== undefined ? lastId : 1; const newUID = uuidv4(); const mainUserUid = await loadingMainUserUid();
 const barWithId = {...newBar,id: newId,uid: newUID,ownerUid: mainUserUid};
  const result = await checkBeforeCRUDExec('Bars', barWithId);
if (result[0] === true) {
try {
await addToObjectStoreExec('Bars', barWithId, null);
setBarList((prevBarList) => [...prevBarList, barWithId]);
const ownerUid = mainUserUid;
const barUid = barWithId.uid;
const theMainUser = await getObjectStoreDataExec('Users', mainUserUid);
if (!theMainUser) { setNotification({ type: 'error', messages: ["Owner not found in the database"]});return;}
// Create full `newUserPermission` object

const currentDate = new Date();
const lastPermissionId = await getLastIdAndSet("BarUserPermissions");
const newPermissionId = lastPermissionId !== null && lastPermissionId !== undefined ? lastPermissionId : 1;
const newUserPermission = { id: newPermissionId, userId: ownerUid, barId: barUid,  grantedBy: ownerUid, grantedAt: currentDate, isMainBar: isMainBar };
// Check for existing permissions
const permissionCheckResult = await checkBeforeCRUDExec('BarUserPermissions', newUserPermission);
if (permissionCheckResult[0] === true) { //const setRequestResult = await setFieldValues('BarUserPermissions','isMainBar',true,{ isMainBar: false}); 
const permissionGranted = await addToObjectStoreExec('BarUserPermissions', newUserPermission, null);

if (permissionGranted){setNotification({type: 'success',messages: ["Permission granted successfully"]});setShowModal(false);} 
else {setNotification({type: 'error',messages: ["Failed to grant permission"]});setShowModal(false);}}
else {setNotification({type: 'error',messages: permissionCheckResult.slice(1)});setShowModal(false);
}} 
catch (error) {
console.error("Error handling bar association:", error);
setNotification({type: 'error',messages: ["An error occurred while processing your request. Please try again."]});
setShowModal(false);}} 
else {setNotification({type: 'error',messages: result.slice(1)});setShowModal(false);}} catch (error) {console.log('Failed to add new bar:', error);setNotification({type: 'error',messages: ['Failed to add new bar', error.message]});setShowModal(false);}}
loadMainBarListExec(mainBarList, setMainBarList);resetBarForm();setShowModal(false);};
const handleSaveLocation = async () => {
// Save the location and switch to bar form with location pre-filled
const fullAddress = `${newLocation.area}, ${newLocation.town}, ${newLocation.state}, ${newLocation.country}`;
setNewBar({ ...newBar, location: fullAddress }); 
setIsBarForm(true);};

const handleAddBar = () => { setEditIndex(null); resetBarForm(); setShowModal(true); setIsBarForm(true); };
const handleAddLocation = async () => {setEditIndex(null);
setNewLocation({country: '',state: '',town: '',area: '',region: '',postalCode: ''});setShowModal(true);setIsBarForm(false); await handleGetCurrentLocation(); };
const resetBarForm = () => {
setNewBar({name: '',location: '',ownerUid: '',uid:'',status: 'inactive',subscriptionExpiration: '',lastPaymentCode: '',lastPaymentMethod: '',numberOfTables: '',totalSales: '',totalGap: '',subscriptionLevel: 'Ordinary'});
setEditIndex(null); setEditingBarId(null);};
// Function to get the user's current location
const handleGetCurrentLocation = async () => {
setLoadingLocation(true); 
if (navigator.geolocation) {  navigator.geolocation.getCurrentPosition(async (position) => { 
const { latitude, longitude } = position.coords;
try {const myAddress = await getAddressFromCoordinates(latitude, longitude);
// Set detected location
setNewLocation({
country: myAddress.country || 'Example Country',state: myAddress.state || 'Example State',town: myAddress.city || 'Example Town',area: myAddress.suburb || '',region: '',postalCode: myAddress.postalCode || ''});
setLoadingLocation(false); } catch (error) {setLoadingLocation(false); }}, (error) => {                setLoadingLocation(false);});} else {setLoadingLocation(false);}};
// LocationIQ API key (replace with your own API key)
const LOCATIONIQ_API_KEY = 'pk.7f4ae5d2b92a01cd5c88d8a5aa675d46';
// Function to get address from coordinates using LocationIQ
async function getAddressFromCoordinates(latitude, longitude) {
try { const response = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`);  if (!response.ok) {     throw new Error(`HTTP error! status: ${response.status}`); }
const data = await response.json();
if (data && data.address) {
const address = {
country: data.address.country || '',state: data.address.state || '',city: data.address.city || data.address.town || data.address.village || '',suburb: data.address.suburb || '',postalCode: data.address.postcode || '',street: data.address.road || '',fullAddress: data.display_name || ''}; return address; } 
else {
throw new Error('Address not found.'); } } catch (error) { console.error('Error fetching address:', error); return null; }}

async function handleDeleteBar (barId){
try { await deleteFromObjectStoreExec('Bars', barId);
 // Assuming you have state for bars, update it to remove the deleted bar
setBarList((prevBarList) => prevBarList.filter((bar) => bar.id !== barId));} 
catch (error) {console.error('Error deleting bar:', error);}}

// Function to filter the bars based on user input
const filteredBars = barList.filter(bar => {
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
if (!selectedBar){setNotification({type: 'warning',messages: ["Select a bar from the table below"]});return;} 
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
const passwordMatches = await comparePassword(ownerPassword, owner.password);
       
if (ownerPhone !== owner.phone || !passwordMatches) {
setNotification({ type: 'error',messages: ["Owner's phone and password do not match, try again"]}); return;}
// Get the last ID and set the new ID accordingly for BarUserPermissions
const lastId = await getLastIdAndSet("BarUserPermissions");
const newId = lastId !== null && lastId !== undefined ? lastId : 1;
// Load the main user UID and set permission details
const mainUserUid = await loadingMainUserUid();
const currentDate = new Date();
myPermis = {id:newId, userId:mainUserUid, barId: bartenderFormData.uid, grantedBy: bartenderFormData.ownerUid, grantedAt: currentDate, isMainBar: true }
await setPermissions(myPermis);} catch (error) {setNotification({ type: 'error',messages: [error]});}};

const insertNewPermission = async(myPermis,checker,result)=>{
checker = await checkBeforeCRUDExec('BarUserPermissions', myPermis);
if(checker[0]!==false){ result= await addToObjectStoreExec('BarUserPermissions', myPermis, null); 
  window.location.reload();
}
else{setNotification({ type: 'error',messages: checker.slice(1)});}

}

const setPermissions = async(myPermis)=>{
    
let recordToChange=null;let allPermissions =null;let isNewPermission = null;let noPermission = null;let allFalse = null;let checker = null;let recordExists = null;let result = null;let isUpdate =null; 

if(myPermis.id && myPermis.barId){     
//checking what to do
try{recordToChange = await getWhereFieldEqualsExec('BarUserPermissions', ["userId","barId"], [myPermis.userId,myPermis.barId]);
allPermissions = await getAllObjectStoreDataExec('BarUserPermissions');
setMainBarList(allPermissions);
if(recordToChange[0].id){isUpdate=true;myPermis.id=recordToChange[0].id;}
else{isUpdate=false;}}catch{}
if(allPermissions){ 
noPermission=false; if(isUpdate===true){isNewPermission=false;} else{isNewPermission=true;}} 
else{ noPermission=true;} 
//no permissions yet
if(noPermission===true){ await insertNewPermission(myPermis,checker,result);}
else{
allFalse = setFieldValues('BarUserPermissions','isMainBar',true,{ isMainBar: false});
//permissions exist but this is a new one
if(isNewPermission===true){
if(!allFalse){setNotification({type: 'Error', messages: ["All false not set successfully"]})}
else{await insertNewPermission(myPermis,checker,result);}
}
else{
//update an existing permission
myPermis.id=recordToChange[0].id;
if(myPermis.id){result= await updateObjectStoreExec('BarUserPermissions', myPermis.id, myPermis); 
}
else{setNotification({ type: 'error', messages: ["Error handling bar association"]});}}}}
else{setNotification({ type: 'error', messages: ["Data Error handling bar association"]});} setShowModal(false);}

const [bartenderFormData, setBartenderFormData] = useState({selectedBar:null,barName:'',uid:'',barLocation:'',barTables:'',ownerPhone:'',ownerPassword:'',isMainBar:true});
//Handle input changes for bartender form
const handleBarTenderInputChange = (e, formType, bar) => {
const { name, value, type } = e.target;
// Check if the input type is a radio for selecting the bar
if (type === "radio" && name === "selectedBar") {
setBartenderFormData({...bartenderFormData,selectedBar: bar.id,uid: bar.uid,
            barName: bar.name,barLocation: bar.location,barTables: bar.numberOfTables,ownerUid: bar.ownerUid,isMainBar:true});}
// Handle changes for ownerPhone and ownerPassword fields
switch (name) { 
case "ownerPhone": setBartenderFormData({ ...bartenderFormData, ownerPhone: value });break;
case "ownerPassword": setBartenderFormData({ ...bartenderFormData, ownerPassword: value }); break;
default: break;}};

const handleEditBar = (index) => { const barToUpdate = barList[index]; setEditIndex(index); setNewBar(barToUpdate); setNewBar({ ...newBar, id: barToUpdate.id,uid: barToUpdate.uid,location: barToUpdate.location, name: barToUpdate.name, numberOfTables: barToUpdate.numberOfTables});  setIsBarForm(true); setShowModal(true);
};

const handleMainBarRadioChange = (e) => {  const value = e.target.value === 'true';  setIsMainBar(value);  };
return (
        <div>
            {role === 'BarOwner' && (<BarOwner barList={barList} setBarList={setBarList} showModal={showModal} setShowModal={setShowModal} isBarForm={isBarForm} editIndex={editIndex} newBar={newBar} handleInputChange={handleInputChange} handleSaveBar={handleSaveBar} handleEditBar={handleEditBar} handleDeleteBar={handleDeleteBar} handleAddLocation={handleAddLocation} newLocation={newLocation} handleLocationInputChange={handleLocationInputChange} handleSaveLocation={handleSaveLocation} loadingLocation={loadingLocation} notification={notification} setNotification={setNotification} isMainBar={isMainBar} setIsMainBar={setIsMainBar} handleMainBarRadioChange={handleMainBarRadioChange}
                />)}
            {role === "Bartender" && !barList && (<div><p>Problem Technique Bars Introuvables</p></div>) }
            {role === "Bartender" && barList !== undefined && (<BarTender syncStatus={syncStatus} error={error} barList={barList} filteredBars={filteredBars} bartenderFormData={bartenderFormData} searchQuery={searchQuery} filterTables={filterTables} handleBarTenderInputChange={handleBarTenderInputChange} handleAssociateBar={handleAssociateBar} setSearchQuery={setSearchQuery} setFilterTables={setFilterTables} notification={notification} isMainBar={isMainBar} setIsMainBar={setIsMainBar} handleMainBarRadioChange={handleMainBarRadioChange}
                /> )}

        </div>
    )
};

export default BarManagement;
