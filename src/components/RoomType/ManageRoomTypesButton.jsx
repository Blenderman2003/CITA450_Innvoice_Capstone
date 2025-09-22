// ManageRoomTypesButton.jsx
// This button now navigates users to the dedicated Room Types page instead of opening a popup

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to programmatically navigate to the Room Types page

const ManageRoomTypesButton = ({ theme }) => {
  const navigate = useNavigate(); // Hook for navigation within the app

  // Redirects to the Room Types page when the button is clicked
  const handleRedirect = () => {
    navigate('/room-types'); // Redirects to the Room Types management page
  };

  return (
    // Button styled with conditional theming, which navigates to Room Types page
    <button
      onClick={handleRedirect}
      className={`${
        theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
      } text-white py-2 px-4 rounded-lg w-full`}
    >
      Manage Room Types
    </button>
  );
};

export default ManageRoomTypesButton;