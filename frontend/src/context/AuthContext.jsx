import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cortex_token');
    localStorage.removeItem('cortex_user');
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('cortex_token');
    const storedUser = localStorage.getItem('cortex_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        client.get('/auth/me')
          .then((res) => {
            setUser(res.data.data.user);
            localStorage.setItem('cortex_user', JSON.stringify(res.data.data.user));
          })
          .catch(() => logout())
          .finally(() => setLoading(false));
      } catch {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback((tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    localStorage.setItem('cortex_token', tokenValue);
    localStorage.setItem('cortex_user', JSON.stringify(userData));
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('cortex_user', JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
