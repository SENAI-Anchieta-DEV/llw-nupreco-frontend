import React from 'react';
import useAuth from '../hooks/useAuth';

const ProtectedAction = ({ allowedRoles = [], children }) => {
  const { user } = useAuth();

  if (!user) return null;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
};

export default ProtectedAction;