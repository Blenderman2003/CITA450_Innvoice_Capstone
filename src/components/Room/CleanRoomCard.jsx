import React, { useState } from 'react';
import roomIcon from '../../assets/images/roomicon.png';
import { getStatusLight } from '../../utils/roomUtils.js';
import axios from 'axios';

const CleanRoomCard = ({ room, theme, updateRoomStatus }) => {
  const [cleanStatus, setCleanStatus] = useState(room.cleanliness || 'Not Clean');

  const handleCleanlinessChange = async (status) => {
    try {
      // Update cleanliness status in the backend
      await axios.put(`/api/rooms/update-cleanliness`, {
        roomNumber: room.roomNumber,
        cleanliness: status,
      });

      // Update the room state locally
      updateRoomStatus((prevRooms) =>
        prevRooms.map((r) =>
          r.roomNumber === room.roomNumber ? { ...r, cleanliness: status } : r
        )
      );
      
      // Update local state
      setCleanStatus(status);
    } catch (error) {
      console.error('Error updating cleanliness status:', error);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-md ${getStatusLight(room.status)} bg-${theme === 'dark' ? 'gray-800' : 'white'}`}
    >
      <div className="flex items-center justify-between">
        <img src={roomIcon} alt="Room Icon" className="w-10 h-10" />
        <span className={`ml-4 text-${theme === 'dark' ? 'white' : 'gray-900'}`}>
          Room {room.roomNumber}
        </span>
      </div>
      <div className="mt-2 text-sm">
        <p>Status: <span className="capitalize">{room.status}</span></p>
        <p>Cleanliness: {cleanStatus}</p>
      </div>

      {/* Cleanliness Status Update */}
      <div className="flex items-center mt-4 space-x-2">
        <label>
          <input
            type="radio"
            name={`cleanliness-${room.roomNumber}`}
            checked={cleanStatus === 'Clean'}
            onChange={() => handleCleanlinessChange('Clean')}
          />
          <span className="ml-2">Clean</span>
        </label>
        <label>
          <input
            type="radio"
            name={`cleanliness-${room.roomNumber}`}
            checked={cleanStatus === 'Not Clean'}
            onChange={() => handleCleanlinessChange('Not Clean')}
          />
          <span className="ml-2">Not Clean</span>
        </label>
      </div>
    </div>
  );
};

export default CleanRoomCard;