import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeContext } from '../ThemeContext'; // Handles light/dark theme across the app
import { UserContext } from '../components/UserContext'; // Provides user authentication context
import Navbar from '../components/Page/Navbar'; // Top navigation bar
import Footer from '../components/Page/Footer'; // Footer for consistent layout
import Popup from '../components/General/Popup'; // Reusable popup for confirmations
import SearchBar from '../components/General/SearchBar'; // Search bar for filtering guests
import GuestForm from '../components/Guest/GuestForm'; // Form for adding/editing guests
import GuestList from '../components/Guest/GuestList'; // List of guests with edit/delete functionality
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

/**
 * GuestManagement Component
 * Manages the guest list with features to add, edit, delete, and search guests.
 */
const GuestManagement = () => {
    const { theme } = useContext(ThemeContext); // Current theme (light/dark)
    const { user } = useContext(UserContext); // Current authenticated user
    const [guests, setGuests] = useState([]); // List of guests fetched from the server
    const [searchQuery, setSearchQuery] = useState(''); // Search term for filtering guests
    const [editingGuest, setEditingGuest] = useState(null); // Guest currently being edited
    const [notification, setNotification] = useState(''); // Notification message for user feedback
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); // State for delete confirmation popup
    const [guestToDelete, setGuestToDelete] = useState(null); // Guest selected for deletion
    const navigate = useNavigate(); // The navigate function is used to redirect to other pages
    /**
     * Fetches the list of guests from the backend API when the component is mounted.
     */
    useEffect(() => {
        fetchGuests();
    }, []);

    /**
     * Fetch guests from the backend API and update the state.
     */
    const fetchGuests = async () => {
        try {
            const response = await axios.post('/routes/protected/guests', {}, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            setGuests(response.data || []);
        } catch (error) {
            console.error('Error fetching guests:', error.response?.data || error.message);
            showNotification('Failed to fetch guests.');
        }
    };

    /**
     * Utility function to show a notification and automatically clear it after 3 seconds.
     * @param {string} message - The message to display in the notification.
     */
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000); // Clears the notification after 3 seconds
    };

    /**
     * Handle adding or updating a guest.
     * Determines the correct API endpoint based on whether the guest has a guestId.
     * @param {Object} guest - The guest object to add or update.
     */
    const handleAddOrUpdateGuest = async (guest) => {
        const endpoint = guest.guestId
            ? '/routes/protected/guests/edit'
            : '/routes/protected/guests/newguest';
        try {
            await axios({
                method: guest.guestId ? 'put' : 'post',
                url: endpoint,
                data: guest,
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            showNotification(`Guest ${guest.guestId ? 'updated' : 'added'} successfully!`);
            fetchGuests(); // Refresh the guest list
            setEditingGuest(null); // Exit edit mode
        } catch (error) {
            console.error('Error saving guest:', error.response?.data || error.message);
            showNotification('Failed to save guest.');
        }
    };

    /**
     * Prepares the delete confirmation popup for a selected guest.
     * @param {Object} guest - The guest to delete.
     */
    const handleDeleteClick = (guest) => {
        setGuestToDelete(guest); // Set the selected guest for deletion
        setIsDeletePopupOpen(true); // Open the delete confirmation popup
    };

    /**
     * Deletes the selected guest from the backend API.
     */
    const handleDeleteGuest = async () => {
        if (!guestToDelete) return; // Exit if no guest is selected
        try {
            await axios.delete('/routes/protected/guests/delete', {
                headers: { Authorization: `Bearer ${user.accessToken}` },
                data: { guestId: guestToDelete.guestId },
            });
            showNotification('Guest deleted successfully!');
            fetchGuests(); // Refresh the guest list
        } catch (error) {
            console.error('Error deleting guest:', error.response?.data || error.message);
            showNotification('Failed to delete guest.');
        } finally {
            setIsDeletePopupOpen(false); // Close the popup
            setGuestToDelete(null); // Clear the selected guest
        }
    };
    let decoded
    try {
        decoded = jwtDecode(user.accessToken).Role;
    }
    catch (error) {
        console.error('Failed to decode token:', error);
    }
    if (decoded === 1) {
        return (
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
                <Navbar /> {/* Top navigation bar */}
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Guest Management</h1>

                    {/* Notification banner */}
                    {notification && (
                        <div className="bg-green-500 text-white py-2 px-4 rounded mb-4 text-center">
                            {notification}
                        </div>
                    )}

                    {/* Search bar for filtering guests */}
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        placeholder="Search guests..."
                        theme={theme}
                    />

                    {/* Form for adding or editing a guest */}
                    <GuestForm
                        guest={editingGuest}
                        setGuest={setEditingGuest}
                        onSave={handleAddOrUpdateGuest}
                        theme={theme}
                    />

                    {/* List of guests with edit and delete options */}
                    <GuestList
                        guests={guests}
                        searchQuery={searchQuery}
                        onEdit={setEditingGuest}
                        onDelete={handleDeleteClick}
                        theme={theme}
                    />

                    {/* Delete confirmation popup */}
                    <Popup
                        isOpen={isDeletePopupOpen}
                        onClose={() => {
                            setIsDeletePopupOpen(false); // Close the popup
                            setGuestToDelete(null); // Clear the selected guest
                        }}
                        title="Confirm Delete"
                        theme={theme}
                    >
                        <p>
                            Are you sure you want to delete {guestToDelete?.firstName} {guestToDelete?.lastName}?
                        </p>
                        <div className="flex mt-4">
                            <button
                                onClick={handleDeleteGuest}
                                className={`p-2 rounded mr-2 ${theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setIsDeletePopupOpen(false)}
                                className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                            >
                                Cancel
                            </button>
                        </div>
                    </Popup>
                </div>
                <Footer /> {/* Bottom footer */}
            </div>
        );
    };
    if (decoded === 2) {
        return (
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
                <Navbar /> {/* Top navigation bar */}
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Guest Management</h1>

                    {/* Notification banner */}
                    {notification && (
                        <div className="bg-green-500 text-white py-2 px-4 rounded mb-4 text-center">
                            {notification}
                        </div>
                    )}

                    {/* Search bar for filtering guests */}
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        placeholder="Search guests..."
                        theme={theme}
                    />

                    {/* Form for adding or editing a guest */}
                    <GuestForm
                        guest={editingGuest}
                        setGuest={setEditingGuest}
                        onSave={handleAddOrUpdateGuest}
                        theme={theme}
                    />

                    {/* List of guests with edit and delete options */}
                    <GuestList
                        guests={guests}
                        searchQuery={searchQuery}
                        onEdit={setEditingGuest}
                        onDelete={handleDeleteClick}
                        theme={theme}
                    />

                    {/* Delete confirmation popup */}
                    <Popup
                        isOpen={isDeletePopupOpen}
                        onClose={() => {
                            setIsDeletePopupOpen(false); // Close the popup
                            setGuestToDelete(null); // Clear the selected guest
                        }}
                        title="Confirm Delete"
                        theme={theme}
                    >
                        <p>
                            Are you sure you want to delete {guestToDelete?.firstName} {guestToDelete?.lastName}?
                        </p>
                        <div className="flex mt-4">
                            <button
                                onClick={handleDeleteGuest}
                                className={`p-2 rounded mr-2 ${theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setIsDeletePopupOpen(false)}
                                className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                            >
                                Cancel
                            </button>
                        </div>
                    </Popup>
                </div>
                <Footer /> {/* Bottom footer */}
            </div>
        );
    };
    if (decoded === 3) {
        return (
            navigate("/home")
        );
    };
};


export default GuestManagement;