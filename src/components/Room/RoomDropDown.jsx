
// RoomDropDown.jsx
// This component provides a dropdown for selecting a room with a searchable input field and programmatic selection.

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../ThemeContext';
import { useNavigate } from 'react-router-dom';

const RoomDropDown = ({ selectedRoom, onSelectRoom }) => {
  const { theme } = useContext(ThemeContext); // Access theme context for light/dark mode styles.
  const navigate = useNavigate(); // Hook for page navigation.

  // State for room data, filter text, error handling, and dropdown visibility.
  const [rooms, setRooms] = useState([]); // List of rooms fetched from the backend.
  const [filter, setFilter] = useState(''); // Text entered in the input field.
  const [error, setError] = useState(null); // Error message if fetching rooms fails.
  const [dropdownVisible, setDropdownVisible] = useState(false); // Controls dropdown visibility.

  // Fetch room data when the component mounts.
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/routes/rooms'); // API call to fetch rooms.
        setRooms(response.data || []); // Save the room data or fallback to an empty array.
      } catch (error) {
        console.error('Error fetching room data:', error); // Log error for debugging.
        setError('Failed to fetch room data. Please try again later.'); // User-friendly error message.
      }
    };

    fetchRooms(); // Trigger the fetch when the component mounts.
  }, []);

  // Set the initial value for editing.
  useEffect(() => {
    if (selectedRoom) {
      const selected = rooms.find((room) => room.roomNumber === selectedRoom);
      if (selected) {
        setFilter(selectedRoom); // Set the input field to the selected room number.
      }
    }
  }, [selectedRoom, rooms]);

  // Handle room selection.
  const handleSelectRoom = (roomValue) => {
    if (roomValue === 'addRoom') {
      navigate('/rooms'); // Navigate to Room Management if "Add Room" is selected.
    } else {
      onSelectRoom(roomValue); // Notify parent about the selected room.
      setFilter(roomValue); // Update the input field with the selected room number.
      setDropdownVisible(false); // Hide the dropdown after selection.
    }
  };

  // Filter the room list based on the user's input.
  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toString().includes(filter) // Match room numbers containing the filter text.
  );

  // Handle input field changes.
  const handleInputChange = (e) => {
    setFilter(e.target.value); // Update the filter state as the user types.
    setDropdownVisible(true); // Show the dropdown when typing.
  };

  // Close the dropdown if the user clicks outside.
  const handleBlur = () => {
    setTimeout(() => setDropdownVisible(false), 200); // Timeout ensures onClick fires before blur.
  };

  return (
    <div>
      {/* Label for the dropdown */}
      <label htmlFor="roomFilter" className="block text-sm font-medium">
        Select Room:
      </label>

      {/* Error message displayed if fetching data fails */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Searchable input field */}
      <input
        id="roomFilter"
        type="text"
        placeholder="Search room by number..."
        value={filter} // Controlled value for the input field.
        onChange={handleInputChange} // Update the filter state and show the dropdown.
        onFocus={() => setDropdownVisible(true)} // Show the dropdown when the input gains focus.
        onBlur={handleBlur} // Hide the dropdown when the input loses focus.
        className={`w-full p-2 rounded mb-2 ${
          theme === 'dark'
            ? 'bg-gray-700 text-white border-gray-600'
            : 'bg-gray-200 text-black border-gray-600'
        }`}
      />

      {/* Dropdown list */}
      {dropdownVisible && (
        <ul
          className={`border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-black'
          } w-auto max-h-auto overflow-y-auto rounded shadow-md absolute z-10`}
        >
          {filteredRooms.map((room) => (
            <li
              key={room.roomNumber}
              className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              onClick={() => handleSelectRoom(room.roomNumber)} // Handle room selection.
            >
              Room {room.roomNumber} - {room.status}
            </li>
          ))}
          <li
            className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
            onClick={() => handleSelectRoom('addRoom')} // Navigate to Room Management.
          >
            Add Room
          </li>
        </ul>
      )}
    </div>
  );
};

export default RoomDropDown;