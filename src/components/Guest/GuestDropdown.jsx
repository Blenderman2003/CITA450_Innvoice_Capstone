// GuestDropdown.jsx
// Provides a searchable dropdown for selecting a guest with dynamic filtering and programmatic selection.

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../ThemeContext';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const GuestDropdown = ({ selectedGuest, onSelectGuest }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [guests, setGuests] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Fetch guest data when the component mounts.
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.post(
          '/routes/protected/guests',
          {},
          { headers: { Authorization: `Bearer ${user?.accessToken || ''}` } }
        );
        setGuests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching guests:', error);
        setError('Failed to fetch guest data. Please try again later.');
      }
    };

    if (user?.accessToken) fetchGuests();
  }, [user?.accessToken]);

  // Set the initial value for editing.
  useEffect(() => {
    if (selectedGuest) {
      const selected = guests.find((guest) => guest.guestId === selectedGuest);
      if (selected) {
        setFilter(`${selected.firstName} ${selected.lastName}`);
      }
    }
  }, [selectedGuest, guests]);

  // Handle guest selection.
  const handleSelectGuest = (guestId) => {
    if (guestId === 'addGuest') {
      navigate('/guestmanagement');
    } else {
      const selectedGuest = guests.find((guest) => guest.guestId === guestId);
      setFilter(`${selectedGuest.firstName} ${selectedGuest.lastName}`);
      onSelectGuest(guestId);
      setDropdownVisible(false);
    }
  };

  // Filter the guest list based on the user's input.
  const filteredGuests = guests.filter((guest) =>
    `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(filter.toLowerCase())
  );

  // Handle input field changes.
  const handleInputChange = (e) => {
    setFilter(e.target.value);
    setDropdownVisible(true);
  };

  // Close the dropdown if the user clicks outside.
  const handleBlur = () => {
    setTimeout(() => setDropdownVisible(false), 200);
  };

  return (
    <div>
      <label htmlFor="guestFilter" className="block text-sm font-medium">
        Select Customer:
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        id="guestFilter"
        type="text"
        placeholder="Search guest by name..."
        value={filter}
        onChange={handleInputChange}
        onFocus={() => setDropdownVisible(true)}
        onBlur={handleBlur}
        className={`w-full p-2 rounded mb-2 ${
          theme === 'dark'
            ? 'bg-gray-700 text-white border-gray-600'
            : 'bg-gray-200 text-black border-gray-600'
        }`}
      />

      {dropdownVisible && (
        <ul
          className={`border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-black'
          } w-auto max-h-auto overflow-y-auto rounded shadow-md absolute z-10`}
        >
          {filteredGuests.map((guest) => (
            <li
              key={guest.guestId}
              className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              onClick={() => handleSelectGuest(guest.guestId)}
            >
              {guest.firstName} {guest.lastName}
            </li>
          ))}
          <li
            className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
            onClick={() => handleSelectGuest('addGuest')}
          >
            Add Guest
          </li>
        </ul>
      )}
    </div>
  );
};

export default GuestDropdown;