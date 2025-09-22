// AddRoomButton.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from '../General/Popup';

const AddRoomButton = ({ theme, fetchAndFilterRooms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newRoomDetails, setNewRoomDetails] = useState({
    roomNumber: '',
    roomTypeCode: '',
    status: 'available'
  });
  const [roomTypeCodes, setRoomTypeCodes] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchRoomTypeCodes = async () => {
      try {
        const response = await axios.get('/routes/roomtypes');
        setRoomTypeCodes(response.data);
      } catch (error) {
        setError('Failed to load room types');
        console.error('Error fetching room types:', error);
      }
    };
    fetchRoomTypeCodes();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newRoomDetails.roomNumber.trim() === '' || newRoomDetails.roomTypeCode.trim() === '') {
      setError('Room number and room type must not be empty.');
      return;
    }

    try {
      const response = await axios.post('/routes/rooms/add', newRoomDetails);

      // Success response handling with explicit message check
      if (response.status === 201 && response.data.message === 'Room added successfully') {
        setSuccessMessage('Room added successfully!');
        fetchAndFilterRooms();

        setTimeout(() => {
          setIsOpen(false);
          setSuccessMessage(null);
          setNewRoomDetails({ roomNumber: '', roomTypeCode: '', status: 'available' });
        }, 1500);
      }
    } catch (error) {
      console.error('Error in catch block:', error);

      if (error.response && error.response.data && error.response.data.sqlMessage && error.response.data.sqlMessage.includes('Duplicate entry')) {
        setError(`Room number ${newRoomDetails.roomNumber} already exists. Please use a different room number.`);
      } else {
        setError('Failed to add room. Please try again.');
      }
    }
  };

  return (
    <>
      <button onClick={() => { 
          setIsOpen(true); 
          setError(null); 
          setSuccessMessage(null); 
        }} 
        className="bg-green-600 text-white hover:bg-green-700  py-2 px-4 rounded-lg w-full">
        Add Room
      </button>

      <Popup isOpen={isOpen} onClose={() => { 
          setIsOpen(false); 
          setError(null); 
          setSuccessMessage(null); 
        }} 
        title="Add Room" theme={theme}>
        <form onSubmit={handleAddRoom} className="space-y-4">
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <label>Room Number:</label>
          <input
            type="number"
            value={newRoomDetails.roomNumber}
            onChange={(e) => setNewRoomDetails({ ...newRoomDetails, roomNumber: e.target.value })}
            className={`input-field border p-2 w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
            required
          />

          <label>Room Type:</label>
          <select
            value={newRoomDetails.roomTypeCode}
            onChange={(e) => setNewRoomDetails({ ...newRoomDetails, roomTypeCode: e.target.value })}
            className="border p-2 w-full"
            required
          >
            <option value="" disabled>Select Room Type</option>
            {roomTypeCodes.map(type => (
              <option key={type.roomTypeCode} value={type.roomTypeCode}>
                {type.roomTypeCode} - {type.description}
              </option>
            ))}
          </select>

          <label>Status:</label>
          <select
            value={newRoomDetails.status}
            onChange={(e) => setNewRoomDetails({ ...newRoomDetails, status: e.target.value })}
            className="border p-2 w-full"
            required
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <button type="submit" className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-lg w-full">
            Add Room
          </button>
        </form>
      </Popup>
    </>
  );
};

export default AddRoomButton;