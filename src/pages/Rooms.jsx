// Rooms.jsx
// Main component for displaying the Room Lookup page with search, filter, room listing, and room management actions.

import { useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Page/Navbar';
import Footer from '../components/Page/Footer';
import { ThemeContext } from '../ThemeContext';
import axios from 'axios';
import RoomCard from '../components/Room/RoomCard';
import RoomFilterControls from '../components/Room/RoomFilterControls';
import SearchBar from '../components/General/SearchBar';
import RoomManagementControls from '../components/Room/RoomManagementControls';
import { clearAllFilters } from '../utils/roomUtils';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../components/UserContext.jsx';

const Rooms = () => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]); // Holds the list of rooms fetched from the server
    const [loading, setLoading] = useState(false); // Loading state indicator
    const [searchQuery, setSearchQuery] = useState(''); // Stores the search term entered by the user
    const [checkedAvailable, setCheckedAvailable] = useState(true); // Filters for 'available' rooms
    const [checkedReserved, setCheckedReserved] = useState(false); // Filters for 'reserved' rooms
    const [checkedMaintanance, setCheckedMaintanance] = useState(false); // Filters for 'maintenance' rooms
    const [checkedNormal, setCheckedNormal] = useState(true); // Filters for normal rooms
    const [checkedSuite, setCheckedSuite] = useState(true); // Filters for suites

    // Clears all filters and resets the search query
    const handleClearFilters = () => {
        clearAllFilters([
            setCheckedAvailable,
            setCheckedReserved,
            setCheckedMaintanance,
            setCheckedNormal,
            setCheckedSuite,
        ]);
        setSearchQuery('');
    };

    // Function to fetch room data from the backend
    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/routes/rooms/with-reservations');
            setRooms(response.data);
        } catch (err) {
            console.error("Error fetching room data:", err);
            setRooms([]); // Ensures rooms list is cleared in case of an error
        } finally {
            setLoading(false); // Ends loading state
        }
    };

    // Fetch rooms data on component mount
    useEffect(() => {
        fetchRooms();
    }, []);

    // Filters the list of rooms based on the selected filters and search query
    const filteredRooms = rooms.filter(room => {
        const matchesType = (checkedNormal && room.isSuite === 0) || (checkedSuite && room.isSuite > 0);
        const matchesStatus =
            (checkedAvailable && room.status === 'available') ||
            (checkedReserved && room.status === 'occupied') ||
            (checkedMaintanance && room.status === 'maintenance');
        const matchesSearch =
            room.roomNumber.toString().includes(searchQuery) ||
            room.roomTypeCode.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesType && matchesStatus && matchesSearch;
    });

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
                <Navbar />

                <div className="container mx-auto p-4 flex-grow">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">Room Lookup</h1>

                    {/* Search Bar */}
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} theme={theme} />

                    {/* Filter Controls and Room Management Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch mb-4">
                        <RoomFilterControls
                            checkedAvailable={checkedAvailable}
                            checkedReserved={checkedReserved}
                            checkedMaintanance={checkedMaintanance}
                            checkedNormal={checkedNormal}
                            checkedSuite={checkedSuite}
                            setCheckedAvailable={setCheckedAvailable}
                            setCheckedReserved={setCheckedReserved}
                            setCheckedMaintanance={setCheckedMaintanance}
                            setCheckedNormal={setCheckedNormal}
                            setCheckedSuite={setCheckedSuite}
                            clearAllFilters={handleClearFilters}
                            theme={theme}
                        />

                        {/* Room Management Controls */}
                        <RoomManagementControls
                            theme={theme}
                            fetchAndFilterRooms={fetchRooms} // Refreshes room list after adding or deleting rooms
                            rooms={rooms}
                        />
                    </div>

                    {/* Room List Display */}
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                        {loading ? (
                            <p>Loading rooms...</p>
                        ) : filteredRooms.length > 0 ? (
                            filteredRooms.map(room => (
                                <RoomCard
                                    key={room.roomNumber}
                                    room={room}
                                    theme={theme}
                                    handleStatusChange={fetchRooms} // Call fetchRooms to refresh data after an update
                                />
                            ))
                        ) : (
                            <p>No rooms match the selected criteria.</p>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        );
    };
    if (decoded === 2) {
        return (
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
                <Navbar />

                <div className="container mx-auto p-4 flex-grow">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">Room Lookup</h1>

                    {/* Search Bar */}
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} theme={theme} />

                    {/* Filter Controls and Room Management Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch mb-4">
                        <RoomFilterControls
                            checkedAvailable={checkedAvailable}
                            checkedReserved={checkedReserved}
                            checkedMaintanance={checkedMaintanance}
                            checkedNormal={checkedNormal}
                            checkedSuite={checkedSuite}
                            setCheckedAvailable={setCheckedAvailable}
                            setCheckedReserved={setCheckedReserved}
                            setCheckedMaintanance={setCheckedMaintanance}
                            setCheckedNormal={setCheckedNormal}
                            setCheckedSuite={setCheckedSuite}
                            clearAllFilters={handleClearFilters}
                            theme={theme}
                        />

                        {/* Room Management Controls */}
                        <RoomManagementControls
                            theme={theme}
                            fetchAndFilterRooms={fetchRooms} // Refreshes room list after adding or deleting rooms
                            rooms={rooms}
                        />
                    </div>

                    {/* Room List Display */}
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                        {loading ? (
                            <p>Loading rooms...</p>
                        ) : filteredRooms.length > 0 ? (
                            filteredRooms.map(room => (
                                <RoomCard
                                    key={room.roomNumber}
                                    room={room}
                                    theme={theme}
                                    handleStatusChange={fetchRooms} // Call fetchRooms to refresh data after an update
                                />
                            ))
                        ) : (
                            <p>No rooms match the selected criteria.</p>
                        )}
                        )
                    </div>
                </div>

                <Footer />
            </div>
        );
    };
    if (decoded === 3) {
        return (
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
                <Navbar />

                <div className="container mx-auto p-4 flex-grow">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">Room Lookup</h1>

                    {/* Search Bar */}
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} theme={theme} />

                    {/* Filter Controls and Room Management Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch mb-4">
                        <RoomFilterControls
                            checkedAvailable={checkedAvailable}
                            checkedReserved={checkedReserved}
                            checkedMaintanance={checkedMaintanance}
                            checkedNormal={checkedNormal}
                            checkedSuite={checkedSuite}
                            setCheckedAvailable={setCheckedAvailable}
                            setCheckedReserved={setCheckedReserved}
                            setCheckedMaintanance={setCheckedMaintanance}
                            setCheckedNormal={setCheckedNormal}
                            setCheckedSuite={setCheckedSuite}
                            clearAllFilters={handleClearFilters}
                            theme={theme}
                        />
                    </div>

                    {/* Room List Display */}
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                        {loading ? (
                            <p>Loading rooms...</p>
                        ) : filteredRooms.length > 0 ? (
                            filteredRooms.map(room => (
                                <RoomCard
                                    key={room.roomNumber}
                                    room={room}
                                    theme={theme}
                                    handleStatusChange={fetchRooms} // Call fetchRooms to refresh data after an update
                                />
                            ))
                        ) : (
                            <p>No rooms match the selected criteria.</p>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        );
    };

};

export default Rooms;