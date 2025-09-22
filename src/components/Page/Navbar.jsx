// Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { UserContext } from '../UserContext';
import { ThemeContext } from '../../ThemeContext';
import UserIconDropdown from './UserIconDropdown';
import HamburgerMenu from './HamburgerMenu'; // Import new HamburgerMenu component

const Navbar = () => {
  const { user, setUser } = React.useContext(UserContext);
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const navigate = useNavigate();

  const logOutCallback = async () => {
    await fetch('/routes/users/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser({});
    navigate('/');
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} relative z-50`}>
      <div className="mx-auto max-w-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* Hamburger Menu on the Left */}
            <HamburgerMenu /> {/* Moved the hamburger icon here */}

            {/* Logo linking to the home page */}
            <Link className="flex items-center ml-4" to="/home">
              <img className="h-10 w-12" src={logo} alt="InnVoice" />
              <span className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-2xl font-bold ml-2`}>
                InnVoice
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* User Icon Dropdown */}
            <UserIconDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;