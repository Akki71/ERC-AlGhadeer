// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, path, ...rest }) => {
  const { authenticated } = useAuth();
  // console.log('Authenticated:', authenticated);

  // Define the paths for the pages that should be protected
  const protectedPaths = ['/dashboard', '/ourcrafts']; // Add your desired paths

  // Check if the current path is in the list of protected paths
  const isProtectedPath = protectedPaths.includes(path);

  if (authenticated || !isProtectedPath) {
    return <Route {...rest} element={element} />;
  } else {
    // console.log('Redirecting to login');
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
