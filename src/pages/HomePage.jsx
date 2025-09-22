import React, { useContext, useState } from 'react'; // Import necessary hooks and libraries
import Navbar from '../components/Page/Navbar'; // Import the top navigation bar component
import Footer from '../components/Page/Footer'; // Import the footer component
import { ThemeContext } from '../ThemeContext'; // Import the theme context to handle dark/light mode switching
import Popup from '../components/General/Popup'; // Import the Popup component for forms
import { useNavigate } from 'react-router-dom'; // Import for navigation between pages
import { UserContext } from '../components/UserContext.jsx';
import { jwtDecode } from 'jwt-decode';

const HomePage = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme

  const navigate = useNavigate(); // The navigate function is used to redirect to other pages

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
            <div
                className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
                    } min-h-screen flex flex-col`}
            >
                {/* Render the top navbar */}
                <Navbar />

                {/* Main content section with a greeting and buttons */}
                <div className="flex-grow flex items-center justify-center m-4">
                    <div
                        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
                            } p-8 rounded-lg shadow-lg w-full max-w-md space-y-6`}
                    >
                        <h1 className="text-3xl text-center font-bold mb-6">Welcome to InnVoice</h1>
                        <p className="mb-10 text-lg">
                            Manage your bookings, guests, and schedules. Get started today!
                        </p>

                        {/* A grid of buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {/* Room Lookup Button */}
                            <button
                                className={`${theme === 'dark'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/rooms')}
                            >
                                Room Lookup
                            </button>

                            {/* Guest Management Button */}
                            <button
                                className={`${theme === 'dark'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/guestmanagement')}
                            >
                                Guest Management
                            </button>

                            {/* Reservations Button */}
                            <button
                                className={`${theme === 'dark'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/reservations')}
                            >
                                Reservations
                            </button>

                            {/* Check-In & Check-Out Button */}
                            <button
                                className={`${theme === 'dark'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/check-in-out')}
                            >
                                Check In & Out
                            </button>
                            <button
                                className={`${theme === 'dark'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/housekeeping')}
                            >
                                Housekeeping
                            </button>
                        </div>
                    </div>
                </div>

                {/* Render the footer at the bottom */}
                <Footer />
            </div>
        );
    }
    if (decoded === 2) {
        return (
            <div
                className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
                    } min-h-screen flex flex-col`}
            >
                {/* Render the top navbar */}
                <Navbar />

                {/* Main content section with a greeting and buttons */}
                <div className="flex-grow flex items-center justify-center m-4">
                    <div
                        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
                            } p-8 rounded-lg shadow-lg w-full max-w-md space-y-6`}
                    >
                        <h1 className="text-3xl text-center font-bold mb-6">Welcome to InnVoice</h1>
                        <p className="mb-10 text-lg">
                            Manage your bookings, guests, and schedules. Get started today!
                        </p>

                        {/* A grid of buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {/* Room Lookup Button */}
                            <button
                                className={`${theme === 'dark'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/rooms')}
                            >
                                Room Lookup
                            </button>

                            {/* Guest Management Button */}
                            <button
                                className={`${theme === 'dark'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/guestmanagement')}
                            >
                                Guest Management
                            </button>

                            {/* Reservations Button */}
                            <button
                                className={`${theme === 'dark'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/reservations')}
                            >
                                Reservations
                            </button>

                            {/* Check-In & Check-Out Button */}
                            <button
                                className={`${theme === 'dark'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/check-in-out')}
                            >
                                Check In & Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Render the footer at the bottom */}
                <Footer />
            </div>
        );
    }
    if (decoded === 3) {
        return (
            <div
                className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
                    } min-h-screen flex flex-col`}
            >
                {/* Render the top navbar */}
                <Navbar />

                {/* Main content section with a greeting and buttons */}
                <div className="flex-grow flex items-center justify-center m-4">
                    <div
                        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
                            } p-8 rounded-lg shadow-lg w-full max-w-md space-y-6`}
                    >
                        <h1 className="text-3xl text-center font-bold mb-6">Welcome to InnVoice</h1>
                        <p className="mb-10 text-lg">
                            Manage your bookings, guests, and schedules. Get started today!
                        </p>

                        {/* A grid of buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {/* Room Lookup Button */}
                            <button
                                className={`${theme === 'dark'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/rooms')}
                            >
                                Room Lookup
                            </button>

                            {/* Reservations Button */}
                            <button
                                className={`${theme === 'dark'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/reservations')}
                            >
                                Reservations
                            </button>

                            {/* Housekeeping Button */}
                            <button
                                className={`${theme === 'dark'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } w-full py-3 px-4 rounded-lg`}
                                onClick={() => navigate('/housekeeping')}
                            >
                                Housekeeping
                            </button>
                        </div>
                    </div>
                </div>

                {/* Render the footer at the bottom */}
                <Footer />
            </div>
        );
    }
};

export default HomePage;
