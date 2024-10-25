import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Notification component
const AlertNotification = ({ type, messages }) => {
  // Define Bootstrap-like classes based on the type of message
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility
  const [isFadingOut, setIsFadingOut] = useState(false); // State to manage fade-out transition

  const notificationClass = {
    success: 'alert alert-success',
    error: 'alert alert-danger',
    warning: 'alert alert-warning',
    info: 'alert alert-info',
  }[type] || 'alert alert-secondary'; // Default class if type is undefined

  // Define appropriate icons based on type
  const icon = {
    success: '✔️', // Checkmark for success
    error: '❌', // Cross mark for error
    warning: '⚠️', // Warning sign
    info: 'ℹ️', // Info sign
  }[type] || '🔔'; // Default icon for undefined types
 // useEffect to set a timeout for 5 seconds to hide the notification
 // useEffect to handle fading out after 5 seconds


// If the notification is not visible, don't render anything

  return (
   <div className={`${notificationClass}`} // Add 'fade-out' class when isFadingOut is true
    role="alert">
      <div className="notification-content">
        {messages && messages.length > 0 ? (
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        ) : (<span></span>)}
      </div>
    </div>
  );
};

// Define PropTypes for type-checking
AlertNotification.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AlertNotification;
