import React, { useState } from 'react';
import './App.css';
import { useSwipeable } from 'react-swipeable'; // Import useSwipeable
import UserManagement from './components/UserManagement';
import BarManagement from './components/BarManagement';
import StockManagement from './components/StockManagement';
import SalesEntry from './components/SalesEntry';
import UnpaidStock from './components/UnpaidStock';
import Reports from './components/Reports';






const App = () => {
  const [currentScreen, setCurrentScreen] = useState('SalesEntry');

  const handlers = useSwipeable({
    

    onSwipedLeft: () => {
      handleSwiped('left');
    },
    onSwipedRight: () => {
      handleSwiped('right');
    },
    trackTouch: true, // Tracks touch gestures (for mobile testing)
    trackMouse: true, // Enables mouse swipe simulation
    // Add other swipe handlers if needed
  });
 
  const handleSwiped = (direction) => {
    switch (currentScreen) {
      case 'UserManagement':
        if (direction === 'left') setCurrentScreen('BarManagement');
        if (direction === 'right') setCurrentScreen('Reports');
      break;
      case 'BarManagement':
        if (direction === 'right') setCurrentScreen('UserManagement');
        else if (direction === 'left') setCurrentScreen('StockManagement');
      break;
      case 'StockManagement':
        if (direction === 'right') setCurrentScreen('BarManagement');
        else if (direction === 'left') setCurrentScreen('SalesEntry');
      break;
      case 'SalesEntry':
        if (direction === 'right') setCurrentScreen('StockManagement');
        else if (direction === 'left') setCurrentScreen('UnpaidStock');
      break;
      case 'UnpaidStock':
          if (direction === 'right') setCurrentScreen('SalesEntry');
          else if (direction === 'left') setCurrentScreen('Reports');
      break;
      case 'Reports':
        if (direction === 'right') setCurrentScreen('UnpaidStock');
        else if (direction === 'left') setCurrentScreen('UserManagement');
     break;
     default:
     break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'UserManagement':
        return <UserManagement />;
      case 'BarManagement':
        return <BarManagement />;
      case 'StockManagement':
        return <StockManagement />;
      case 'SalesEntry':
        return <SalesEntry />;
      case 'UnpaidStock':
        return <UnpaidStock />;
      case 'Reports':
        return <Reports />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div {...handlers} style={{ width: '100%', height: '100vh'}}>
      {renderScreen()}
    </div>
  );
};

export default App;
