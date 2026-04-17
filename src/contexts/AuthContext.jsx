import React, { createContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';
import { getStoredUser, getToken, clearSession } from '../utils/token';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setUser(storedUser);
    } else {
      clearSession();
      setUser(null);
    }

    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const loggedUser = await authService.login(email, senha);
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};