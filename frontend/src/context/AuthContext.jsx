import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuth, setStoredAuth, removeStoredAuth } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ✅ Initialize directly from localStorage — no race condition
  const storedAuth = getStoredAuth();
  const [user, setUser]     = useState(storedAuth?.user  || null);
  const [token, setToken]   = useState(storedAuth?.token || null);
  const [loading, setLoading] = useState(false); // ✅ No async needed

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setStoredAuth({ user: userData, token: authToken });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeStoredAuth();
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};