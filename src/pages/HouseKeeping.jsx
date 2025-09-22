import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Page/Navbar';
import Footer from '../components/Page/Footer';
import CleanRoomCard from '../components/Room/CleanRoomCard';
import HouseKeepingFilterControls from '../components/Room/HouseKeepingFilterControls';
import { ThemeContext } from '../ThemeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../components/UserContext.jsx';

const HouseKeeping = () => {
    const [rooms, setRooms] = useState([]); // Holds all rooms fetched from the backend
    const [filteredRooms, setFilteredRooms] = useState([]); // Holds rooms after applying filters
    const [checkedNormal, setCheckedNormal] = useState(true); // Filters for normal rooms
    const [checkedSuite, setCheckedSuite] = useState(true); // Filters for suites
    const [searchQuery, setSearchQuery] = useState(''); // Search query
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate(); // The navigate function is used to redirect to other pages

    const { user, setUser } = useContext(UserContext);
    let decoded
    try {
        console.log(user);
        decoded = jwtDecode(user.accessToken).Role;
        con
    }
    catch (error) {
        console.error('Failed to decode token:', error);
    }
    useEffect(() => {
        // Fetch maintenance rooms from the database
        const fetchMaintenanceRooms = async () => {
            try {
                const response = await axios.get('/routes/rooms/with-reservations'); // Replace with your endpoint
                const maintenanceRooms = response.data.filter(room => room.status === 'maintenance');
                setRooms(maintenanceRooms);
                setFilteredRooms(maintenanceRooms);
            } catch (error) {
                console.error('Error fetching maintenance rooms:', error);
            }
        };
        fetchMaintenanceRooms();
    }, []);

    // Filters rooms based on type (Normal/Suite) and search query
    useEffect(() => {
        const filtered = rooms.filter((room) => {
            const matchesType =
                (checkedNormal && room.isSuite === 0) ||
                (checkedSuite && room.isSuite > 0);
            const matchesSearch = room.roomNumber.toString().includes(searchQuery);

            return matchesType && matchesSearch;
        });
        setFilteredRooms(filtered);
    }, [rooms, checkedNormal, checkedSuite, searchQuery]);

    if (decoded === 1) {
        return (
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
                <Navbar />
                <div className="container mx-auto p-4 flex-grow">
                    <h1 className="text-2xl font-bold mb-4">Housekeeping - Room Cleanliness</h1>

                    {/* Filter Controls */}
                    <HouseKeepingFilterControls
                        checkedNormal={checkedNormal}
                        checkedSuite={checkedSuite}
                        setCheckedNormal={setCheckedNormal}
                        setCheckedSuite={setCheckedSuite}
                        clearAllFilters={() => {
                            setCheckedNormal(true);
                            setCheckedSuite(true);
                            setSearchQuery('');
                        }}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        theme={theme}
                    />

                    {/* Room Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map((room) => (
                                <CleanRoomCard
                                    key={room.roomNumber}
                                    room={room}
                                    theme={theme}
                                    updateRoomStatus={setRooms} // Pass setRooms to update the room status dynamically
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
            navigate("/home")
        );
    };
    if (decoded === 3) {
        return (
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
                <Navbar />
                <div className="container mx-auto p-4 flex-grow">
                    <h1 className="text-2xl font-bold mb-4">Housekeeping - Room Cleanliness</h1>

                    {/* Filter Controls */}
                    <HouseKeepingFilterControls
                        checkedNormal={checkedNormal}
                        checkedSuite={checkedSuite}
                        setCheckedNormal={setCheckedNormal}
                        setCheckedSuite={setCheckedSuite}
                        clearAllFilters={() => {
                            setCheckedNormal(true);
                            setCheckedSuite(true);
                            setSearchQuery('');
                        }}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        theme={theme}
                    />

                    {/* Room Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map((room) => (
                                <CleanRoomCard
                                    key={room.roomNumber}
                                    room={room}
                                    theme={theme}
                                    updateRoomStatus={setRooms} // Pass setRooms to update the room status dynamically
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

export default HouseKeeping;