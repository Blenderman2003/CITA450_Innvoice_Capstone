// RoomManagementControls.jsx
// Component for managing room operations including adding, deleting rooms, and navigating to Room Types management

import React from 'react';
import AddRoomButton from './AddRoomButton';
import DeleteRoomButton from './DeleteRoomButton';
import ManageRoomTypesButton from '../RoomType/ManageRoomTypesButton'; // Button now redirects to Room Types page

const RoomManagementControls = ({ theme, fetchAndFilterRooms, rooms }) => {
  return (
      <div className={`p-4 rounded w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} md:mx-2`}>
      <h3 className="text-lg md:text-2xl font-bold mb-4 text-center">Room Management</h3>
      <div className="flex flex-col md:flex-row gap-2 justify-evenly">
        {/* Button for adding a new room, opens a form popup */}
        <AddRoomButton theme={theme} fetchAndFilterRooms={fetchAndFilterRooms} />
        
        {/* Button for deleting a room, opens a confirmation popup */}
        <DeleteRoomButton theme={theme} fetchAndFilterRooms={fetchAndFilterRooms} rooms={rooms} />
        
        {/* Redirects to the Room Types management page */}
        <ManageRoomTypesButton theme={theme} />
      </div>
    </div>
  );
};

export default RoomManagementControls;