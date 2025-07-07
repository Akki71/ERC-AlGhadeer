import React, { useEffect } from 'react';
import BASE_PATH from '../serviceurls';

function TokenPage({ setGetToken }) {
 
  useEffect(() => {
   
    const fetchToken = async () => {
      // localStorage.removeItem("token");
      try {
        const postData = {
          'UserName': 'GHADEER',
          'Password': 'GHADEER123',
          'GrantType': 'password'
        };

        const response = await fetch(`${BASE_PATH}Security/GetToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch token');
        }

        const data = await response.json();
        localStorage.setItem('token', data.AccessToken);
        setGetToken(data.AccessToken);

        // Set token expiration time
        const expirationTime = new Date().getTime() + 3500000; // 1 hour in milliseconds
        localStorage.setItem("tokenExpiration", expirationTime);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem("tokenExpiration");
    const currentTime = new Date().getTime();

    if (!token || (currentTime >= expiration)) {
      // If token doesn't exist or has expired, fetch a new one
      fetchToken();
    } else {
      // Token exists and hasn't expired yet
      setGetToken(token);
    }

    // Automatically hit the API again after 1 hour to refresh the token
    const tokenRefreshTimer = setInterval(() => {
      fetchToken();
    }, 3500000); // 1 hour in milliseconds

    // Clean up the timer when component unmounts
    return () => clearInterval(tokenRefreshTimer);
  }, [setGetToken]); // Fetch token only if not available

  return (
    <div>
      {/* Optionally, you can add any UI components here */}
    </div>
  );
}

export default TokenPage;
