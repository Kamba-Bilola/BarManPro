import React from 'react';
import { useSwipeable } from 'react-swipeable';

const SwipeTest = () => {
  // Handlers for swipe actions
  const handlers = useSwipeable({
    onSwipedLeft: () => alert('Swiped Left'),
    onSwipedRight: () => alert('Swiped Right'),
    onSwipedUp: () => alert('Swiped Up'),
    onSwipedDown: () => alert('Swiped Down'),
    // Optionally add more handlers
  });

  return (
    <div 
      {...handlers} 
      style={{ 
        width: '100%', 
        height: '100vh', 
        backgroundColor: 'lightgray', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '24px'
      }}
    >
      Swipe here
    </div>
  );
};

export default SwipeTest;
