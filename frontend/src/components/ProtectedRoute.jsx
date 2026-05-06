import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika role tidak sesuai, arahkan ke dashboard masing-masing
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/siswa/histori'} replace />;
  }

  return children;
};

export default ProtectedRoute;
