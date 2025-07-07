import React, { createContext, useContext, useState } from 'react';
import AuthService from './pages/AuthService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (EmailId, Password, FirstName) => {
    try {
      // Use the login function from AuthService
      const response = await AuthService.login(EmailId, Password, FirstName);
      
      if (response.data.UserId) { // Check if UserId exists in the response
        // If the login is successful, update the user state
        setUser({
          EmailId: response.data.EmailId,
          FirstName: FirstName || response.data.FirstName,
          // Add other user-related data as needed
        });
      } else {
        // If the login fails, handle the error (e.g., show an alert)
        console.error('Login failed:', response.error);
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };
  

  const logout = () => {
    // Your logout logic
    setUser(null);
    // localStorage.removeItem("loginToken");
    // localStorage.removeItem("UserID");
    // console.log("AuthContaxt page executed");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
