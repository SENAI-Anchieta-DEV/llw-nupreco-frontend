import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

<<<<<<< HEAD

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();


  if (loading) {
    return null;
  }

<<<<<<< HEAD

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }


  return children;
};


export default PrivateRoute;

=======
  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace />;
  }

  return children;
};

export default PrivateRoute;
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
