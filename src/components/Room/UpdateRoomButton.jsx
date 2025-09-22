// UpdateRoomButton.jsx
// Component for the "Update Room" button and associated popup form.

import React, { useState, useEffect } from 'react';
import Popup from '../General/Popup';
import axios from 'axios';

const UpdateRoomButton = ({ theme, room, handleStatusChange }) => {
  const [isRoomEditOpen, setRoomEditOpen] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [roomDetails, setRoomDetails] = useState({
    nightlyRate: room.nightlyRate,
    roomTypeCode: room.roomTypeCode,
    status: room.status,
    numberOfBeds: room.numberOfBeds,
  });
  const [roomTypeCodes, setRoomTypeCodes] = useState([]);

  // Fetch room types on mount
  useEffect(() => {
    const fetchRoomTypeCodes = async () => {
      try {
        const response = await axios.get('/routes/roomtypes');
        setRoomTypeCodes(response.data);
      } catch (error) {
        console.error('Error fetching room types:', error);
      }
    };
    fetchRoomTypeCodes();
  }, []);

  // Form submission opens confirmation popup
  const handleRoomUpdateSubmit = (e) => {
    e.preventDefault();
    setConfirmPopupOpen(true);
  };

  // Sends updated room data to server after confirmation
  const confirmRoomUpdate = async () => {
    try {
      await axios.put('/routes/rooms/update', {
        roomNumber: room.roomNumber,
        roomTypeCode: roomDetails.roomTypeCode,
        status: roomDetails.status,
      });
      setRoomEditOpen(false); // Close the edit popup
      handleStatusChange(); // Trigger refresh to show updated room details
    } catch (error) {
      console.error('Failed to update room:', error);
    } finally {
      setConfirmPopupOpen(false); // Close the confirmation popup
    }
  };

  return (
    <>
      {/* Update Room Button */}
      <button
        onClick={() => setRoomEditOpen(true)}
        className={`${theme === 'dark' ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-yellow-500 text-white hover:bg-yellow-600'} p-1.5 rounded-lg text-center`}
      >
        Update Room
      </button>

      {/* Update Room Popup */}
      <Popup isOpen={isRoomEditOpen} onClose={() => setRoomEditOpen(false)} title={`Update Room ${room.roomNumber}`} theme={theme}>
        <form onSubmit={handleRoomUpdateSubmit} className="space-y-4">
          <label>Room Type Code:</label>
          <select
            value={roomDetails.roomTypeCode}
            onChange={(e) => setRoomDetails({...roomDetails, roomTypeCode: e.target.value})}
            className="border p-2 w-full"
          >
            <option value="" disabled>Select Room Type</option>
            {roomTypeCodes.map((type) => (
              <option key={type.roomTypeCode} value={type.roomTypeCode}>
                {type.roomTypeCode} - {type.description}
              </option>
            ))}
          </select>

          <label>Status:</label>
          <select
            value={roomDetails.status}
            onChange={(e) => setRoomDetails({...roomDetails, status: e.target.value})}
            className="border p-2 w-full"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <button type="submit" className={`${theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'} p-1.5 rounded-lg w-full`}>Save Changes</button>
        </form>
      </Popup>

      {/* Confirmation Popup */}
      <Popup isOpen={isConfirmPopupOpen} onClose={() => setConfirmPopupOpen(false)} title="Confirm Changes" theme={theme}>
        <p>Are you sure you want to save these changes for Room {room.roomNumber}?</p>
        <div className="flex space-x-4 mt-4">
          <button onClick={confirmRoomUpdate} className="bg-green-500 text-white p-2 rounded-lg w-full">Yes, Confirm</button>
          <button onClick={() => setConfirmPopupOpen(false)} className="bg-gray-300 text-black p-2 rounded-lg w-full">Cancel</button>
        </div>
      </Popup>
    </>
  );
};

export default UpdateRoomButton;