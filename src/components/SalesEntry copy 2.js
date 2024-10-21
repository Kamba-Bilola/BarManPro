import React, { useState, useEffect } from 'react'; // Import useEffect to load items from localStorage
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, showSalesModal } from '../redux/slices/indicationSlice';
import { Modal, Button, Table } from 'react-bootstrap';

const SalesEntry = () => {
  const dispatch = useDispatch();
  const { sales, showSalesModal: isModalVisible, dayStarted } = useSelector((state) => state.indication);

  // State for managing the items retrieved from localStorage
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('stock')) || [];
    setItems(storedItems);
  }, []);

  const handleAddItem = (item) => {
    dispatch(addItem(item));
  };

  const handleRemoveItem = (item) => {
    dispatch(removeItem(item));
  };

  const [currentSizeIndex, setCurrentSizeIndex] = useState({});

  const handleArrowClick = (direction, item) => {
    if (item.sizes && item.sizes.length > 1) {
      const currentIndex = currentSizeIndex[item.id] || 0;
      let newIndex;

      if (direction === 'up') {
        newIndex = (currentIndex + 1) % item.sizes.length;
      } else {
        newIndex = (currentIndex - 1 + item.sizes.length) % item.sizes.length;
      }

      setCurrentSizeIndex({
        ...currentSizeIndex,
        [item.id]: newIndex,
      });
    }
  };

  return (
    <div className="container mt-4">
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
                    onClick={() =>
                      handleAddItem({ ...item, price: displayItem.price, size: displayItem.size })
                    }
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
                      onClick={() =>
                        handleRemoveItem({ ...item, price: displayItem.price, size: displayItem.size })
                      }
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

      <Modal show={isModalVisible} onHide={() => dispatch(showSalesModal(false))}>
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
          <Button variant="secondary" onClick={() => dispatch(showSalesModal(false))}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SalesEntry;
