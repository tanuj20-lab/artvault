import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashMap = { artist: '/artist-dashboard', buyer: '/buyer-dashboard', admin: '/admin-dashboard' };
    return <Navigate to={dashMap[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
