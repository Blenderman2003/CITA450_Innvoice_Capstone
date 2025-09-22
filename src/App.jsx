// App.jsx
// Main application component, setting up routes and managing layout and context providers

import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import axios from 'axios';

// Pages
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import RoomsPage from './pages/Rooms';
import ReservationsPage from './pages/Reservations';
import ProtectedRoute from './components/ProtectedRoute';
import GuestManagement from './pages/GuestManagement';
import RoomTypes from './pages/RoomTypes'; 
import CheckInOut from './pages/CheckInOut'; // Import CheckInOut page
import HouseKeeping from './pages/HouseKeeping';

// Contexts
import { UserProvider } from './components/UserContext';
import ThemeProvider from './ThemeContext';

// Import the floating ThemeToggle component
import ThemeToggle from './components/Page/ThemeToggle';

function App() {
  // Define the routes for the application using React Router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<LoginPage />} /> 
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/housekeeping' element={<HouseKeeping />} />  

        {/* Protected routes for authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/rooms' element={<RoomsPage />} />
          <Route path='/reservations' element={<ReservationsPage />} />
          <Route path='/guestmanagement' element={<GuestManagement />} />
          <Route path='/room-types' element={<RoomTypes />} />
          <Route path='/check-in-out' element={<CheckInOut />} /> {/* New CheckInOut route */}
          <Route path='/housekeeping' element={<HouseKeeping />} /> {/* New house keeping route */}
        </Route>
        
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );

  // Wraps the application with ThemeProvider and UserProvider for global state management
  return (
    <ThemeProvider>
      <UserProvider>
        <RouterProvider router={router} />
        <ThemeToggle /> {/* Floating theme toggle component */}
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
