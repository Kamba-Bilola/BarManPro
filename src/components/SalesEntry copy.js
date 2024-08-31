
// src/components/salesEntry.js
import React, { useState } from 'react';
//import { Modal, Button, Form, Table } from 'react-bootstrap';
import { Modal,Button, ButtonGroup, ToggleButton, Form, Table } from 'react-bootstrap';

// Mock data for items
const initialItems = [
    { id: 1, name: 'Beer', sizes: [
        { size: 'Small', price: 500, image: 'beer_small.png' },
        { size: 'Medium', price: 1000, image: 'beer_medium.png' },
        { size: 'Large', price: 1500, image: 'beer_large.png' },
        { size: 'Extra Large', price: 2000, image: 'beer_extra_large.png' },
    ]},
    { id: 2, name: 'Whiskey', sizes: [
        { size: 'Small', price: 1500, image: 'whiskey_small.png' },
        { size: 'Medium', price: 2000, image: 'whiskey_medium.png' },
        { size: 'Large', price: 2500, image: 'whiskey_large.png' },
        { size: 'Extra Large', price: 3000, image: 'whiskey_extra_large.png' },
    ]},
    { id: 3, name: 'Wine', sizes: [
        { size: 'Small', price: 1000, image: 'wine_small.png' },
        { size: 'Medium', price: 1500, image: 'wine_medium.png' },
        { size: 'Large', price: 2000, image: 'wine_large.png' },
        { size: 'Extra Large', price: 2500, image: 'wine_extra_large.png' },
    ]},
    { id: 4, name: 'Vodka', sizes: [
        { size: 'Small', price: 2000, image: 'vodka_small.png' },
        { size: 'Medium', price: 2500, image: 'vodka_medium.png' },
        { size: 'Large', price: 3000, image: 'vodka_large.png' },
        { size: 'Extra Large', price: 3500, image: 'vodka_extra_large.png' },
    ]},
    { id: 5, name: 'Rum', price: 1800, image: 'rum.png' },
    { id: 6, name: 'Gin', price: 2300, image: 'gin.png' },
    { id: 7, name: 'Tequila', price: 2700, image: 'tequila.png' },
    { id: 8, name: 'Brandy', price: 2600, image: 'brandy.png' },
    { id: 9, name: 'Champagne', price: 3000, image: 'champagne.png' },
    { id: 10, name: 'Cider', price: 800, image: 'cider.png' },
    { id: 11, name: 'Sake', price: 2200, image: 'sake.png' },
    { id: 12, name: 'Scotch', price: 3200, image: 'scotch.png' },
    { id: 13, name: 'Bourbon', price: 2900, image: 'bourbon.png' },
    { id: 14, name: 'Rosé Wine', price: 1600, image: 'rose_wine.png' },
    { id: 15, name: 'White Wine', price: 1400, image: 'white_wine.png' },
    { id: 16, name: 'Red Wine', price: 1700, image: 'red_wine.png' },
    { id: 17, name: 'Port Wine', price: 2100, image: 'port_wine.png' },
    { id: 18, name: 'Sherry', price: 1900, image: 'sherry.png' },
    { id: 19, name: 'Absinthe', price: 3500, image: 'absinthe.png' },
    { id: 20, name: 'Mead', price: 1300, image: 'mead.png' },
    { id: 21, name: 'Aperol', price: 2400, image: 'aperol.png' },
    { id: 22, name: 'Campari', price: 2500, image: 'campari.png' },
    { id: 23, name: 'Vermouth', price: 2000, image: 'vermouth.png' },
    { id: 24, name: 'Cognac', price: 3400, image: 'cognac.png' },
    { id: 25, name: 'Armagnac', price: 3300, image: 'armagnac.png' },
    { id: 26, name: 'Baijiu', price: 4000, image: 'baijiu.png' },
    { id: 27, name: 'Soju', price: 1000, image: 'soju.png' },
    { id: 28, name: 'Schnapps', price: 2100, image: 'schnapps.png' },
    { id: 29, name: 'Amaretto', price: 2300, image: 'amaretto.png' },
    { id: 30, name: 'Limoncello', price: 1500, image: 'limoncello.png' },
    { id: 31, name: 'Grappa', price: 2700, image: 'grappa.png' },
    { id: 32, name: 'Pisco', price: 2800, image: 'pisco.png' },
    { id: 33, name: 'Jägermeister', price: 2100, image: 'jagermeister.png' },
    { id: 34, name: 'Cachaça', price: 2000, image: 'cachaca.png' },
    { id: 35, name: 'Irish Cream', price: 1800, image: 'irish_cream.png' },
    { id: 36, name: 'Bitters', price: 1400, image: 'bitters.png' },
    { id: 37, name: 'Triple Sec', price: 1300, image: 'triple_sec.png' },
    { id: 38, name: 'Blue Curacao', price: 1500, image: 'blue_curacao.png' },
    { id: 39, name: 'Kahlúa', price: 1900, image: 'kahlua.png' },
    { id: 40, name: 'Fernet', price: 2500, image: 'fernet.png' },
    { id: 41, name: 'Ouzo', price: 1600, image: 'ouzo.png' },
    { id: 42, name: 'Pastis', price: 1800, image: 'pastis.png' },
    { id: 43, name: 'Rakija', price: 2200, image: 'rakija.png' },
    { id: 44, name: 'Slivovitz', price: 2300, image: 'slivovitz.png' },
    { id: 45, name: 'Arak', price: 1900, image: 'arak.png' },
    { id: 46, name: 'Tej', price: 1100, image: 'tej.png' },
    { id: 47, name: 'Palm Wine', price: 1200, image: 'palm_wine.png' },
    { id: 48, name: 'Toddy', price: 900, image: 'toddy.png' },
    { id: 49, name: 'Hard Cider', price: 1000, image: 'hard_cider.png' },
    { id: 50, name: 'Kombucha', price: 800, image: 'kombucha.png' },
  ];
  

const SalesEntry = () => {
  // States for managing sales and UI behavior
  const [items, setItems] = useState(initialItems);
  const [sales, setSales] = useState([]);
  const [dayStarted, setDayStarted] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startAmount, setStartAmount] = useState(10000); // Example starting amount
  const [currentAmount, setCurrentAmount] = useState(0);
  const [showSalesModal, setShowSalesModal] = useState(false);

  // Function to handle starting and ending the day
  const handleToggleDay = (e) => {
    const shouldStartDay = !dayStarted; // Toggle the current state
    if (shouldStartDay) {
      if (window.confirm('Are you sure you want to start the day?')) {
        setDayStarted(true);
        setStartDate(new Date().toLocaleString()); // Set the current date and time when starting the day
        // Your additional logic for starting the day
      }
    } else {
      if (window.confirm('Are you sure you want to end the day?')) {
        // Update the starting amount by adding the current amount to it
        setStartAmount(startAmount + currentAmount);
        setCurrentAmount(0); // Reset current amount for the next day
      }
    }
  };
  

  // Function to handle adding an item to the day's sales
  const handleAddItem = (item) => {
    const updatedSales = [...sales, item];
    setSales(updatedSales);
    setCurrentAmount(currentAmount + item.price);
  };
  const [currentSizeIndex, setCurrentSizeIndex] = useState({}); // To track the current size index for each item

  const handleArrowClick = (direction, item) => {
    if (item.sizes && item.sizes.length > 1) {
      const currentIndex = currentSizeIndex[item.id] || 0;
      let newIndex;
      
      if (direction === 'up') {
        newIndex = (currentIndex + 1) % item.sizes.length; // Move to next size, cycle back to the first if at the end
      } else {
        newIndex = (currentIndex - 1 + item.sizes.length) % item.sizes.length; // Move to previous size, cycle to the last if at the start
      }
  
      setCurrentSizeIndex({
        ...currentSizeIndex,
        [item.id]: newIndex,
      });
    }
  };
  // Function to handle removing an item from the day's sales
  const handleRemoveItem = (item) => {
    const updatedSales = sales.filter((sale) => sale.id !== item.id);
    setSales(updatedSales);
    setCurrentAmount(currentAmount - item.price);
  };

  // Function to display sales of the day
  const handleViewSales = () => {
    setShowSalesModal(true);
  };

  return (
    <div className="container mt-4">
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

      {/* Stock Update Section */}
      <div className="stock-update-section">
        <div className="row">
        {items.map((item) => {
  const sizeIndex = currentSizeIndex[item.id] || 0;
  const displayItem = item.sizes ? item.sizes[sizeIndex] : item;

  return (
    <div key={item.id} className="col-3 mb-3">
      <div className={`item-card p-3 ${!dayStarted ? 'disabled' : ''}`}>
        <h5>
          {item.name}
          {item.sizes && ` (${displayItem.size})`}
        </h5>
        <img
          src={displayItem.image}
          alt={`${item.name} (${displayItem.size})`}
          className={`img-fluid ${!dayStarted ? 'disabled' : ''}`}
          onClick={() => handleAddItem({ ...item, price: displayItem.price, size: displayItem.size })}
          style={{ pointerEvents: dayStarted ? 'auto' : 'none', cursor: dayStarted ? 'pointer' : 'not-allowed' }}
        />
        <div className="d-flex justify-content-between align-items-center mt-2">
          {item.sizes && item.sizes.length > 1 && (
            <>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => handleArrowClick('up', item)}
                disabled={!dayStarted}
              >
                ↑
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleArrowClick('down', item)}
                disabled={!dayStarted}
              >
                ↓
              </Button>
            </>
          )}
          <Button
            variant="danger"
            onClick={() => handleRemoveItem({ ...item, price: displayItem.price, size: displayItem.size })}
            disabled={!dayStarted}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
})}

        </div>
      </div>

      {/* Modal to display sales of the day */}
      <Modal show={showSalesModal} onHide={() => setShowSalesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sales of the Day</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const itemSalesCount = sales.filter((sale) => sale.id === item.id).length;
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{itemSalesCount}</td>
                    <td>{itemSalesCount * item.price} (FCFA)</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSalesModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SalesEntry;
