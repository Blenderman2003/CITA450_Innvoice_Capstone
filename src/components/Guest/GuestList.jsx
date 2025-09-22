import React from 'react';
import guestIcon from '../../assets/images/guesticon.png'; // Icon for guest display

/**
 * GuestList Component
 * Renders a list of guests with edit and delete actions.
 *
 * Props:
 * - guests: Array of all guest objects to display.
 * - searchQuery: Current search term for filtering guests.
 * - onEdit: Callback for editing a guest.
 * - onDelete: Callback for selecting a guest to delete.
 * - theme: Current theme ('dark' or 'light') for dynamic styling.
 */
const GuestList = ({ guests, searchQuery, onEdit, onDelete, theme }) => {
    // Filter guests based on the search query
    const filteredGuests = guests.filter(
        (guest) =>
            guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Display filtered guests */}
            {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                    <div
                        key={guest.guestId}
                        className={`flex items-center border rounded p-4 shadow ${
                            theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
                        }`}
                    >
                        {/* Guest Icon */}
                        <img
                            src={guestIcon}
                            alt="Guest Icon"
                            className="w-16 h-16 rounded-full mr-4"
                        />

                        {/* Guest Details */}
                        <div className="flex-1">
                            <p
                                className={`font-bold text-lg ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                }`}
                            >
                                {guest.firstName} {guest.lastName}
                            </p>
                            <p className="text-sm">{guest.email || 'Email: N/A'}</p>
                            <p className="text-sm">{guest.phone || 'Phone: N/A'}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col">
                            {/* Edit Button */}
                            <button
                                onClick={() => onEdit(guest)}
                                className={`p-1 rounded-lg mt-2 ${
                                    theme === 'dark'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                Edit
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={() => onDelete(guest)}
                                className={`p-1 rounded-lg mt-2 ${
                                    theme === 'dark'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                // Message when no guests match the search query
                <p className="col-span-full text-center text-gray-500">
                    No guests found.
                </p>
            )}
        </div>
    );
};

export default GuestList;