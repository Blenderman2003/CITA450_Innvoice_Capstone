// RoomTypes.jsx
// Page for managing room types, including CRUD operations and success notifications.

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Page/Navbar';
import Footer from '../components/Page/Footer';
import { ThemeContext } from '../ThemeContext';
import Popup from '../components/General/Popup';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../components/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const RoomTypes = () => {
    const { theme } = useContext(ThemeContext); // For theme styling
    const [roomTypes, setRoomTypes] = useState([]); // Holds the list of room types
    const [newRoomType, setNewRoomType] = useState({ roomTypeCode: '', description: '', nightlyRate: '', numberOfBeds: '', isSuite: 0 });
    const [editingRoomType, setEditingRoomType] = useState(null); // Track room type currently being edited
    const [roomTypeToDelete, setRoomTypeToDelete] = useState(null); // Track room type to be deleted
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); // Control delete confirmation popup
    const [notification, setNotification] = useState(''); // State to hold success messages
    const navigate = useNavigate(); // The navigate function is used to redirect to other pages

    // Fetches room types from the server on component mount
    const fetchRoomTypes = async () => {
        try {
            const response = await axios.get('/routes/roomtypes');
            setRoomTypes(response.data);
        } catch (error) {
            console.error('Error fetching room types:', error);
        }
    };

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    // Displays notification message briefly
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000); // Clears message after 3 seconds
    };

    // Handles adding a new room type
    const handleAddRoomType = async () => {
        try {
            await axios.post('/routes/roomtypes/add', newRoomType);
            fetchRoomTypes(); // Refresh the list
            setNewRoomType({ roomTypeCode: '', description: '', nightlyRate: '', numberOfBeds: '', isSuite: 0 });
            showNotification('Room type added successfully!'); // Show success message
        } catch (error) {
            console.error('Error adding room type:', error);
        }
    };

    // Handles updating an existing room type
    const handleUpdateRoomType = async () => {
        try {
            await axios.put('/routes/roomtypes/update', editingRoomType);
            fetchRoomTypes(); // Refresh the list
            setEditingRoomType(null); // Exit edit mode
            showNotification('Room type updated successfully!'); // Show success message
        } catch (error) {
            console.error('Error updating room type:', error);
        }
    };

    // Opens delete confirmation popup for the selected room type
    const confirmDeleteRoomType = (roomType) => {
        setRoomTypeToDelete(roomType);
        setIsDeletePopupOpen(true);
    };

    // Deletes a room type and refreshes the list
    const handleDeleteRoomType = async () => {
        try {
            await axios.delete(`/routes/roomtypes/delete/${roomTypeToDelete.roomTypeCode}`);
            fetchRoomTypes();
            setIsDeletePopupOpen(false); // Close popup after deletion
            setRoomTypeToDelete(null); // Reset delete tracking
            showNotification('Room type deleted successfully!'); // Show success message
        } catch (error) {
            console.error('Error deleting room type:', error);
        }
    };

    const { user, setUser } = useContext(UserContext);
    let decoded
    try {
        console.log(user);
        decoded = jwtDecode(user.accessToken).Role;
        console.log('Decoded Token:', decoded);
    }
    catch (error) {
        console.error('Failed to decode token:', error);
    }

    if (decoded === 1) {
        return (
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
                {/* Navbar at the top */}
                <Navbar />

                <div className="p-6 container mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Room Type Management</h1>

                    {/* Notification banner */}
                    {notification && (
                        <div className="bg-green-500 text-white py-2 px-4 rounded mb-4 text-center">
                            {notification}
                        </div>
                    )}

                    {/* Form for adding or editing room types */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">{editingRoomType ? 'Edit Room Type' : 'Add New Room Type'}</h2>

                        {/* Room Type Code Field */}
                        <input
                            type="text"
                            placeholder="Room Type Code"
                            value={editingRoomType ? editingRoomType.roomTypeCode : newRoomType.roomTypeCode}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, roomTypeCode: e.target.value })
                                : setNewRoomType({ ...newRoomType, roomTypeCode: e.target.value })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                            readOnly={!!editingRoomType} // Read-only in edit mode
                        />

                        {/* Description Field */}
                        <input
                            type="text"
                            placeholder="Description"
                            value={editingRoomType ? editingRoomType.description : newRoomType.description}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, description: e.target.value })
                                : setNewRoomType({ ...newRoomType, description: e.target.value })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        />

                        {/* Nightly Rate Field */}
                        <input
                            type="number"
                            placeholder="Nightly Rate"
                            value={editingRoomType ? editingRoomType.nightlyRate : newRoomType.nightlyRate}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, nightlyRate: parseFloat(e.target.value) })
                                : setNewRoomType({ ...newRoomType, nightlyRate: parseFloat(e.target.value) })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        />

                        {/* Number of Beds Field */}
                        <input
                            type="number"
                            placeholder="Number of Beds"
                            value={editingRoomType ? editingRoomType.numberOfBeds : newRoomType.numberOfBeds}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, numberOfBeds: parseInt(e.target.value) })
                                : setNewRoomType({ ...newRoomType, numberOfBeds: parseInt(e.target.value) })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        />

                        {/* Suite Type Field (Changed to number input to support range 0-3) */}
                        <input
                            type="number"
                            placeholder="Suite Type (0-3)"
                            value={editingRoomType ? editingRoomType.isSuite : newRoomType.isSuite}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, isSuite: parseInt(e.target.value) })
                                : setNewRoomType({ ...newRoomType, isSuite: parseInt(e.target.value) })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        />

                        {/* Action Buttons for Add/Update */}
                        <button
                            onClick={editingRoomType ? handleUpdateRoomType : handleAddRoomType}
                            className={`${theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'} p-2 rounded w-full mb-2`}
                        >
                            {editingRoomType ? 'Update Room Type' : 'Add Room Type'}
                        </button>
                        {editingRoomType && (
                            <button
                                onClick={() => setEditingRoomType(null)}
                                className={`p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400 text-black'
                                    }`}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    {/* Display list of existing room types */}
                    <div className="room-type-list grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {roomTypes.map(type => (
                            <div key={type.roomTypeCode} className={`border p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                <div className="text-lg font-bold mb-1">{type.roomTypeCode}</div>
                                <p className="mb-1">{type.description}</p>
                                <p className="mb-1">Nightly Rate: ${parseFloat(type.nightlyRate).toFixed(2)}</p>
                                <p className="mb-1">Beds: {type.numberOfBeds}</p>
                                <p className="mb-2">Suite Type: {type.isSuite}</p>
                                <div className="flex space-x-2">
                                    <button onClick={() => setEditingRoomType(type)}
                                        className={`p-2 rounded-lg mt-2 ${theme === 'dark'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}>Edit</button>
                                    <button onClick={() => confirmDeleteRoomType(type)}
                                        className={`p-2 rounded-lg mt-2 ${theme === 'dark'
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                            }`}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delete confirmation popup */}
                <Popup
                    isOpen={isDeletePopupOpen}
                    onClose={() => setIsDeletePopupOpen(false)}
                    title="Confirm Delete"
                    theme={theme}
                >
                    <p>Are you sure you want to delete {roomTypeToDelete ? roomTypeToDelete.roomTypeCode : 'this room type'}?</p>
                    <button onClick={handleDeleteRoomType} className="bg-red-600 text-white py-2 px-4 rounded-lg mr-2">Yes, Delete</button>
                    <button onClick={() => setIsDeletePopupOpen(false)} className="bg-gray-300 text-black py-2 px-4 rounded-lg">Cancel</button>
                </Popup>

                {/* Footer at the bottom */}
                <Footer />
            </div>
        );
    };
    if (decoded === 2) {
        return (
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
                {/* Navbar at the top */}
                <Navbar />

                <div className="p-6 container mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Room Type Management</h1>

                    {/* Notification banner */}
                    {notification && (
                        <div className="bg-green-500 text-white py-2 px-4 rounded mb-4 text-center">
                            {notification}
                        </div>
                    )}

                    {/* Form for adding or editing room types */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">{editingRoomType ? 'Edit Room Type' : 'Add New Room Type'}</h2>

                        {/* Room Type Code Field */}
                        <input
                            type="text"
                            placeholder="Room Type Code"
                            value={editingRoomType ? editingRoomType.roomTypeCode : newRoomType.roomTypeCode}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, roomTypeCode: e.target.value })
                                : setNewRoomType({ ...newRoomType, roomTypeCode: e.target.value })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                            readOnly={!!editingRoomType} // Read-only in edit mode
                        />

                        {/* Description Field */}
                        <input
                            type="text"
                            placeholder="Description"
                            value={editingRoomType ? editingRoomType.description : newRoomType.description}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, description: e.target.value })
                                : setNewRoomType({ ...newRoomType, description: e.target.value })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        />

                        {/* Nightly Rate Field */}
                        <input
                            type="number"
                            placeholder="Nightly Rate"
                            value={editingRoomType ? editingRoomType.nightlyRate : newRoomType.nightlyRate}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, nightlyRate: parseFloat(e.target.value) })
                                : setNewRoomType({ ...newRoomType, nightlyRate: parseFloat(e.target.value) })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        />

                        {/* Number of Beds Field */}
                        <input
                            type="number"
                            placeholder="Number of Beds"
                            value={editingRoomType ? editingRoomType.numberOfBeds : newRoomType.numberOfBeds}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, numberOfBeds: parseInt(e.target.value) })
                                : setNewRoomType({ ...newRoomType, numberOfBeds: parseInt(e.target.value) })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        />

                        {/* Suite Type Field (Changed to number input to support range 0-3) */}
                        <input
                            type="number"
                            placeholder="Suite Type (0-3)"
                            value={editingRoomType ? editingRoomType.isSuite : newRoomType.isSuite}
                            onChange={e => editingRoomType
                                ? setEditingRoomType({ ...editingRoomType, isSuite: parseInt(e.target.value) })
                                : setNewRoomType({ ...newRoomType, isSuite: parseInt(e.target.value) })}
                            className={`border p-2 rounded w-full mb-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        />

                        {/* Action Buttons for Add/Update */}
                        <button
                            onClick={editingRoomType ? handleUpdateRoomType : handleAddRoomType}
                            className={`${theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'} p-2 rounded w-full mb-2`}
                        >
                            {editingRoomType ? 'Update Room Type' : 'Add Room Type'}
                        </button>
                        {editingRoomType && (
                            <button
                                onClick={() => setEditingRoomType(null)}
                                className={`p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400 text-black'
                                    }`}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    {/* Display list of existing room types */}
                    <div className="room-type-list grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {roomTypes.map(type => (
                            <div key={type.roomTypeCode} className={`border p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                <div className="text-lg font-bold mb-1">{type.roomTypeCode}</div>
                                <p className="mb-1">{type.description}</p>
                                <p className="mb-1">Nightly Rate: ${parseFloat(type.nightlyRate).toFixed(2)}</p>
                                <p className="mb-1">Beds: {type.numberOfBeds}</p>
                                <p className="mb-2">Suite Type: {type.isSuite}</p>
                                <div className="flex space-x-2">
                                    <button onClick={() => setEditingRoomType(type)}
                                        className={`p-2 rounded-lg mt-2 ${theme === 'dark'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}>Edit</button>
                                    <button onClick={() => confirmDeleteRoomType(type)}
                                        className={`p-2 rounded-lg mt-2 ${theme === 'dark'
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                            }`}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delete confirmation popup */}
                <Popup
                    isOpen={isDeletePopupOpen}
                    onClose={() => setIsDeletePopupOpen(false)}
                    title="Confirm Delete"
                    theme={theme}
                >
                    <p>Are you sure you want to delete {roomTypeToDelete ? roomTypeToDelete.roomTypeCode : 'this room type'}?</p>
                    <button onClick={handleDeleteRoomType} className="bg-red-600 text-white py-2 px-4 rounded-lg mr-2">Yes, Delete</button>
                    <button onClick={() => setIsDeletePopupOpen(false)} className="bg-gray-300 text-black py-2 px-4 rounded-lg">Cancel</button>
                </Popup>

                {/* Footer at the bottom */}
                <Footer />
            </div>
        );
    };
    if (decoded === 3) {
        return (
            navigate("/home")
        );
    };
};

export default RoomTypes;