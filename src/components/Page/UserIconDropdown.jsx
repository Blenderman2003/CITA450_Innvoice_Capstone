import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import usericon from '../../assets/images/usericon.png';
import { ThemeContext } from '../../ThemeContext'; // Import theme context for dynamic theme handling
import { UserContext } from '../UserContext'; 

const UserIconDropdown = () => {
    const { user, setUser, loading } = useContext(UserContext); // Access user and loading state from context

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { theme } = useContext(ThemeContext); // Access theme from context

    // Function to handle user logout
    const logOutCallback = async () => {
        await fetch('/routes/users/logout', {
        method: 'POST',
        credentials: 'include',
        });
        setUser({}); // Clear user data upon logout
        navigate('/'); // Redirect to home page
        window.location.reload(); // Fix for user token not being set instantly
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => setIsOpen((prev) => !prev);

    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


        // Handle loading state
    if (loading) {
        return <div>Loading...</div>; // Optionally, show a loading spinner or similar here
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User Icon Button */}
            <button 
                onClick={toggleDropdown} 
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'
                } focus:outline-none`}
            >
                <img src={usericon} alt="User" className="w-6 h-6" />
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute top-full right-0 w-48 mt-2 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out ${
                    isOpen ? 'opacity-100 z-50' : 'opacity-0 hidden'
                } ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
            >
                <ul className="flex flex-col p-4 text-center">
                    {!user.accessToken ? (
                        <>
                            <li className="my-2">
                                <Link
                                    to="/login"
                                    className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    Login
                                </Link>
                            </li>
                            <li className="my-2">
                                <Link
                                    to="/signup"
                                    className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    Signup
                                </Link>
                            </li>
                        </>
                        ) : (
                        <li className="my-2">
                            <button
                                onClick={logOutCallback} // Replace with actual logout handler
                                className="block w-full py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default UserIconDropdown;
