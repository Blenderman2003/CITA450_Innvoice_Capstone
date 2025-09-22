import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Page/Navbar';
import Footer from '../components/Page/Footer';
import BackgroundLogo from '../components/Page/BackgroundLogo';
import { ThemeContext } from '../ThemeContext';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');  // Success message
  const [error, setError] = useState('');  // Error message
  const { theme } = useContext(ThemeContext); // Access theme context
  const navigate = useNavigate(); // For navigation

  // Update form data on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/routes/users/signup', formData); // Send signup data
      setMessage('🎉 Registration successful! Redirecting you to Login Page in 3 seconds.');
      setError('');

      // Wait 3 seconds, then navigate to login
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Error during sign-up:', error);
      // Set specific error message if user exists
      if (error.response && error.response.status === 400) {
        setError('⚠️ User with this email or username already exists.');
      } else {
        setError('⚠️ Registration failed. Please try again.');
      }
      setMessage('');
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen flex flex-col`}>
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <BackgroundLogo>
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} p-8 rounded-lg shadow-lg w-full max-w-md space-y-6`}>
            <h1 className="text-3xl font-bold text-center">Create Your Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-red-400`}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-red-400`}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-red-400`}
                  placeholder="Create a password"
                  required
                />
              </div>
              <button type="submit" className={`${theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} w-full py-3 px-4 rounded-lg`}>
                Sign Up
              </button>
            </form>
            {message && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </BackgroundLogo>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
