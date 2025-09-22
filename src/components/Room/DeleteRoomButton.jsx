// DeleteRoomButton.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Popup from '../General/Popup';

const DeleteRoomButton = ({ theme, fetchAndFilterRooms, rooms }) => {
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const confirmDeleteRoom = async () => {
    setError(null); // Clear any previous errors
    setSuccessMessage(null); // Clear previous success message

    try {
      await axios.delete(`/routes/rooms/${roomToDelete}`);
      setSuccessMessage('Room deleted successfully!');
      fetchAndFilterRooms(); // Refresh the room list after deletion
      setTimeout(() => {
        setDeleteOpen(false);
        setConfirmDeleteOpen(false);
        setSuccessMessage(null); // Clear success message after closing
        setRoomToDelete(null); // Reset the selected room
      }, 1500);
    } catch (error) {
      setError('Failed to delete room. Please try again.');
      console.error('Error deleting room:', error);
    }
  };

  return (
    <>
      {/* Button to open the "Delete Room" popup */}
      <button onClick={() => setDeleteOpen(true)} className="bg-red-600 text-white hover:bg-red-700  py-2 px-4 rounded-lg w-full">
        Delete Room
      </button>

      {/* Popup for selecting a room to delete */}
      <Popup isOpen={isDeleteOpen} onClose={() => { setDeleteOpen(false); setError(null); setSuccessMessage(null); }} title="Delete Room" theme={theme}>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <p>Select a room to delete:</p>
        <select onChange={(e) => setRoomToDelete(e.target.value)} value={roomToDelete} className="border p-2 w-full mb-4">
          <option value="" disabled>Select Room Number</option>
          {rooms.map(room => (
            <option key={room.roomNumber} value={room.roomNumber}>{room.roomNumber}</option>
          ))}
        </select>
        <button
          onClick={() => roomToDelete && setConfirmDeleteOpen(true)}
          className="bg-red-600 text-white hover:bg-red-700 py-2 px-4 rounded-lg w-full"
          disabled={!roomToDelete}
        >
          Confirm Deletion
        </button>
      </Popup>

      {/* Popup for confirming room deletion */}
      <Popup isOpen={isConfirmDeleteOpen} onClose={() => { setConfirmDeleteOpen(false); setError(null); }} title="Confirm Delete Room" theme={theme}>
        <p>Are you sure you want to delete room {roomToDelete}? This action cannot be undone.</p>
        <button onClick={confirmDeleteRoom} className="bg-red-600 text-white py-2 px-4 rounded-lg w-full">
          Yes, Delete Room
        </button>
      </Popup>
    </>
  );
};

export default DeleteRoomButton;