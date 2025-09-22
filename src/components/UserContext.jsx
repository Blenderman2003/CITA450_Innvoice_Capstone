import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const UserContext = createContext([]);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ accessToken: null });
  const [loading, setLoading] = useState(true);
  const isRefreshingRef = useRef(false); // Use a ref to track refresh status
  const failedQueue = useRef([]); // To store requests that failed due to expired token

  // Set up Axios interceptors
  // BTW this doesnt work at all
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Attach token to request headers if it exists
        if (user.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 or 403 and the request has not been retried yet
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
          if (isRefreshingRef.current) {
            // If a refresh is in progress, queue the request
            return new Promise((resolve, reject) => {
              failedQueue.current.push({ resolve, reject });
            });
          }

          isRefreshingRef.current = true; // Set refresh in progress

          originalRequest._retry = true; // Mark the request as retried

          try {
          console.log('attempting refresh')

            // Attempt to refresh the token
            const response = await axios.post('/routes/tokens/refresh_token', {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true, // Include cookies if necessary
            });

            console.log('old token: ', user.accessToken)

            let token
            if (response) {
              token = response.data.accessToken;
              //console.log('setting user token: ', token)
              setUser({ accessToken: token });
            }
            else {
              // IDK give up IG
              return
            }

            console.log('new token: ', token)

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Update default header

            // Retry all failed requests
            failedQueue.current.forEach(({ resolve }) => resolve(axios(originalRequest)));
            failedQueue.current = []; // Clear the queue

            return axios(originalRequest); // Retry the original request
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            failedQueue.current.forEach(({ reject }) => reject(refreshError));
            failedQueue.current = []; // Clear the queue
          } finally {
            isRefreshingRef.current = false; // Reset the refreshing status
          }
        }

        return Promise.reject(error); // Reject the error if it's not a 401 or refresh failed
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user.accessToken]);

  useEffect(() => {
    async function checkRefreshToken() {
      if (isRefreshingRef.current) return; // Prevent concurrent calls
      isRefreshingRef.current = true; // Set the flag to true

      try {
        const result = await axios.post('/routes/tokens/refresh_token', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (result) {
          const token = result.data.accessToken;
          //console.log('setting user token: ', token)
          setUser({ accessToken: token });
        }
      } catch (error) {
        console.error('Error checking refresh token:', error);
      } finally {
        isRefreshingRef.current = false; // Reset the flag when done
        setLoading(false);
      }
    }

    checkRefreshToken(); // Call the function when the component mounts
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {loading ? <div>Loading ...</div> : children}
    </UserContext.Provider>
  );
};
