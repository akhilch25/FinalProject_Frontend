import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const empID = localStorage.getItem('empID');

  // Check for admin access (only for EMP000)
  const isAdmin = empID === "EMP000";

  // Determine the current path
  const currentPath = window.location.pathname;

  if (isAuthenticated) {
    if (currentPath.includes('/add-course') || currentPath.includes('/assign-course') || currentPath.includes('/analytics') || currentPath.includes('/employee-courses')) {
      // Allow access only for admin
      return isAdmin ? element : <Navigate to="/" />;
    } else if (currentPath.includes('/userdash')) {
      // Allow access only for users other than EMP000
      return isAdmin ? <Navigate to="/" /> : element;
    }
    // If the route is not matched, allow access
    return element;
  }

  // Redirect to login if not authenticated
  return <Navigate to="/" />;
};

export default PrivateRoute;
