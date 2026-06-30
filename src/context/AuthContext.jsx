// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check localStorage
        const storedToken = localStorage.getItem('token') || localStorage.getItem('userToken');
        const storedUser = localStorage.getItem('user') || localStorage.getItem('userData');
        
        // Check cookies as backup
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
        
        const cookieToken = cookies.token;
        const cookieUser = cookies.user;

        // Use either localStorage or cookies
        const finalToken = storedToken || cookieToken;
        const finalUser = storedUser ? JSON.parse(storedUser) : (cookieUser ? JSON.parse(cookieUser) : null);

        if (finalToken && finalUser) {
          setUser(finalUser);
          setToken(finalToken);
          setIsAuthenticated(true);
          console.log('✅ Auth restored:', finalUser.name);
        } else {
          console.log('❌ No auth found');
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
    
    // Store in localStorage
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Store in cookies
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    document.cookie = `token=${authToken}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    document.cookie = `user=${JSON.stringify(userData)}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    document.cookie = `isLoggedIn=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userData', JSON.stringify(userData));
    document.cookie = `user=${JSON.stringify(userData)}; path=/; expires=${new Date(Date.now() + 7*24*60*60*1000).toUTCString()}; SameSite=Lax`;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      loading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};