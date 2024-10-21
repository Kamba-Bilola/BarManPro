// src/components/indicationBar.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDay, showSalesModal } from '../redux/slices/indicationSlice';
import { Button, Form , Modal } from 'react-bootstrap';
import { ReactComponent as Logo } from '../assets/svg/logo.svg';
import { ReactComponent as MenuIcon } from '../assets/svg/menu_bars.svg';
import { ReactComponent as ServerIcon } from '../assets/svg/server.svg';
const IndicationBar = ({ user }) => {
  const dispatch = useDispatch();
  const { dayStarted, startDate, startAmount, currentAmount } = useSelector((state) => state.indication);
   // State for controlling the visibility of the user details modal
   const [showUserModal, setShowUserModal] = useState(false);
  const handleToggleDay = () => {
    dispatch(toggleDay());
  };

  const handleViewSales = () => {
    dispatch(showSalesModal(true));
  };
// Function to show the modal
const handleShowUserDetails = () => {
  setShowUserModal(true);
  console.log(user);
};

// Function to hide the modal
const handleCloseUserModal = () => {
  setShowUserModal(false);
};
  return (
    <div className="indication-bar container-fluid grid-container pt-2">
    
   
       
        <div id="logo" className="border-box rowspan2">
              <a href='/'><Logo /></a>
        </div>
        <div id="brand_name" className="border-box colspan5"><span>BAR_MAN_PRO</span>
        <Button id="userDetails" onClick={handleShowUserDetails}><span>{user.displayName ? user.displayName.split(' ').map(word => word[0]).join('') : " ? "}</span></Button></div>
        <div id="col3" ></div>
        <div id="menu_bars" className="border-box rowspan2"><a href='#'><MenuIcon/></a></div>
        
        
        <div id="bar_name" className="border-box colspan5"><span>MASSANGA BAR</span></div>
        <div id="col7" className="border-box"></div>
        
       
        <div id="dayswitch" className="border-box colspan2">
              <Form.Check
                type="switch"
                id="day-toggle-switch"
                //label={dayStarted ? 'End the Day' : 'Start the Day'}
                checked={dayStarted}
                onChange={handleToggleDay}
                className={dayStarted ? 'text-danger' : 'text-success'}
              />
        </div>
        <div id="amount" className="border-box colspan4"> <span>{currentAmount} <span className="fcfa">FCFA</span></span></div>
        <div id="sales_report" className="border-box colspan2"> <Button  className="day_sales" onClick={handleViewSales}>Ventes du jour</Button></div>
  

        <div id="date" className="border-box colspan4"><span className="mb-2 mb-md-0">Date: {startDate || 'Non active'}</span></div>
        <div id="date" className="border-box colspan4"><span className="ms-md-3 mb-2 mb-md-0">Capital: {startAmount} FCFA</span></div>
       
        <Modal show={showUserModal} onHide={handleCloseUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {user.displayName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Add other user details as needed */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>

      
  );
};

export default IndicationBar;