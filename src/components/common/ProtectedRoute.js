import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ userType }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (userType && currentUser.userType !== userType) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;