import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './UserContext'; 
import axios from 'axios';

const ProtectedRoute = () => {
  const { user, loading } = useContext(UserContext); // Access user and loading state from context

  //console.log(loading)

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // Optionally, show a loading spinner or similar here
  }

  // Check if user has access token
  if (!user.accessToken) {
    console.log('no token');
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  //console.log('render page');
  return <Outlet />; // Render the protected routes
};

export default ProtectedRoute;
