// HamburgerMenu.jsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../ThemeContext';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../components/UserContext.jsx';

const HamburgerMenu = () => {
    const { theme } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    // Close menu if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //Decodes the token to use the Role Id
    //Decodes the token to use the Role Id
    const { user, setUser } = useContext(UserContext);
    let decoded
    try {
        decoded = jwtDecode(user.accessToken).Role;
    }
    catch (error) {
        console.error('Failed to decode token:', error);
    }
    if (decoded === 1) {
        return (
            <div className="relative" ref={menuRef}>
                {/* Hamburger Icon */}
                <button onClick={toggleMenu} className="text-3xl focus:outline-none">
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>&#9776;</span>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 w-48 ${isOpen ? 'block' : 'hidden'} z-50 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} shadow-lg rounded-lg transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <ul className="flex flex-col p-4 text-center">
                        <li className="my-2">
                            <Link to="/home" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Home</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/dashboard" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Dashboard</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/rooms" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Room Lookup</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/reservations" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Reservations</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/guestmanagement" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Guest Management</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/check-in-out" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">CheckIn & Out</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/housekeeping" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Housekeeping</Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
    if (decoded === 2) {
        return (
            <div className="relative" ref={menuRef}>
                {/* Hamburger Icon */}
                <button onClick={toggleMenu} className="text-3xl focus:outline-none">
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>&#9776;</span>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 w-48 ${isOpen ? 'block' : 'hidden'} z-50 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} shadow-lg rounded-lg transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <ul className="flex flex-col p-4 text-center">
                        <li className="my-2">
                            <Link to="/home" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Home</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/dashboard" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Dashboard</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/rooms" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Room Lookup</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/reservations" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Reservations</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/guestmanagement" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Guest Management</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/check-in-out" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">CheckIn & Out</Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
    if (decoded === 3) {
        return (
            <div className="relative" ref={menuRef}>
                {/* Hamburger Icon */}
                <button onClick={toggleMenu} className="text-3xl focus:outline-none">
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>&#9776;</span>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 w-48 ${isOpen ? 'block' : 'hidden'} z-50 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} shadow-lg rounded-lg transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <ul className="flex flex-col p-4 text-center">
                        <li className="my-2">
                            <Link to="/home" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Home</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/dashboard" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Dashboard</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/rooms" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Room Lookup</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/reservations" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Reservations</Link>
                        </li>
                        <li className="my-2">
                            <Link to="/housekeeping" className="block py-2 px-4 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700">Housekeeping</Link>
                        </li>

                    </ul>
                </div>
            </div>
        );
    }
};

export default HamburgerMenu;
