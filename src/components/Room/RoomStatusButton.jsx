// RoomStatusButton.jsx
// Component for the "Room Status" button and associated popup form.

import React, { useState } from 'react';
import Popup from '../General/Popup';
import axios from 'axios';

const RoomStatusButton = ({ theme, room, handleStatusChange }) => {
  const [isRoomStatusOpen, setRoomStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(room.status);

  // Handles room status update submission
  const handleRoomStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/routes/rooms/update-status', {
        roomNumber: room.roomNumber,
        status: newStatus,
      });
      setRoomStatusOpen(false); // Close the status popup
      handleStatusChange(); // Trigger refresh to show updated room status
    } catch (error) {
      console.error('Failed to update room status:', error);
    }
  };

  return (
    <>
      {/* Room Status Button */}
      <button
        onClick={() => setRoomStatusOpen(true)}
        className={`${theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600'} p-1.5 rounded-lg`}
      >
        Room Status
      </button>

      {/* Room Status Popup */}
      <Popup isOpen={isRoomStatusOpen} onClose={() => setRoomStatusOpen(false)} title="Room Status" theme={theme}>
        <form onSubmit={handleRoomStatusSubmit} className="space-y-4">
          <label className="block text-lg">Status:</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border p-2 mb-4 w-full"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button type="submit" className={`${theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600'} p-1.5 rounded-lg w-full`}>Submit</button>
        </form>
      </Popup>
    </>
  );
};

export default RoomStatusButton;