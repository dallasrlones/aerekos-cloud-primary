import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage, refreshAccessToken, publicFetch } from '../services/httpService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount try to restore session by refreshing token if needed
    (async () => {
      try {
        const access = storage.getAccessToken();
        if (access) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        const newToken = await refreshAccessToken();
        if (newToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = ({ accessToken, refreshToken }) => {
    storage.setTokens({ accessToken, refreshToken });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // call logout endpoint to invalidate tokens server-side where possible
    try {
      const refreshToken = storage.getRefreshToken();
      const accessToken = storage.getAccessToken();
      await publicFetch('/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken, accessToken })
      });
    } catch (e) {
      // ignore errors
    }
    storage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
