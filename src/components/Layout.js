// src/components/Layout.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDay, updateAmounts } from '../redux/slices/indicationSlice';
import { Button, Form } from 'react-bootstrap';
import { useEffect } from 'react';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { dayStarted, startDate, startAmount, currentAmount } = useSelector(state => state.indication);

  const handleToggleDay = () => {
    dispatch(toggleDay());
  };

  const handleViewSales = () => {
    // Implement the function to view sales
  };

  useEffect(() => {
    // Optional: Initialize or update amounts on component mount
  }, [dispatch]);

  return (
    <div>
      {/* Indication Bar */}
      <div className="indication-bar d-flex justify-content-between align-items-center mb-4">
        <Form.Check
          type="switch"
          id="day-toggle-switch"
          label={dayStarted ? 'End the Day' : 'Start the Day'}
          checked={dayStarted}
          onChange={handleToggleDay}
          className={dayStarted ? 'text-danger' : 'text-success'}
        />
        <div>
          <span>Date & Time: {startDate || 'Not started'}</span>
          <span className="ms-3">Starting Amount: {startAmount} (FCFA)</span>
          <span className="ms-3">Current Amount: {currentAmount} (FCFA)</span>
          <Button variant="info" className="ms-3" onClick={handleViewSales}>
            View Sales of the Day
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
