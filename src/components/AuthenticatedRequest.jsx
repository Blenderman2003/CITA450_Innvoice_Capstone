import axios from 'axios';
import React, { useContext } from 'react';
import { UserContext } from './UserContext';

/*
EXAMPLE ON USE:

const route = 'Rooms'; // Your API endpoint, Does NOT NEED the /routes/protected as all request go through it, just add your end point
    const args = {
      email: 'user@example.com', // Example email
      password: 'password123', // Example password
    };
    const additionalHeaders = {
      'Content-Type': 'application/json', // Specify content type
      'Custom-Header': 'CustomValue', // Any other custom header
    };

    const response = await AuthorizedRequest(route, args, additionalHeaders);
*/

// Considering hard coding the /routes/protected in since its all protected routes
const AuthenticatedRequest = async (method, route, args = {}, additionalHeaders = {}) => {
    
    const { user } = useContext(UserContext); // Access user context

    const config = {
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        ...additionalHeaders, // Merge any additional headers
      },
    };
  
    let response;
    // Do some validation on route
    const protectedRoute = 'routes/protected' + route

    console.log(protectedRoute);
    try {
      // Choose the appropriate axios method
      switch (method.toUpperCase()) {
        case 'GET':
          response = await axios.get(protectedRoute, { headers: config.headers });
          break;
        case 'POST':
          response = await axios.post(protectedRoute, args, config);
          break;
        case 'PUT':
          response = await axios.put(protectedRoute, args, config);
          break;
        case 'DELETE':
          response = await axios.delete(protectedRoute, { headers: config.headers });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    } catch (error) {
      console.error(`Error during ${method} request:`, error); // Handle error
      throw error; // Rethrow error for further handling if needed
    }
  
    return response
  }

export default AuthenticatedRequest