// NotificationBanner.jsx
// A reusable component for displaying success or error notifications.

import React from 'react';

// NotificationBanner Component
// Props:
// - message: The notification message to display.
// - onClose: Function called when the close button is clicked.
// - theme: Current theme ('dark' or 'light') for styling.
const NotificationBanner = ({ message, onClose, theme }) => {
  if (!message) return null; // Do not render if there's no message

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-center z-50 ${
        theme === 'dark' ? 'bg-green-700 text-white' : 'bg-green-500 text-white'
      }`}
    >
      {/* Display the message */}
      <span>{message}</span>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="ml-4 px-2 py-1 rounded bg-white text-green-700 hover:bg-gray-200"
      >
        Close
      </button>
    </div>
  );
};

export default NotificationBanner;