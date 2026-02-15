import { createContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('cx_token');
      if (token) {
        setAuthToken(token);
        try {
          const res = await api.get('/users/me');
          setUser(res.data);
        } catch (e) {
          console.error('Failed to load user:', e);
          localStorage.removeItem('cx_token');
          setAuthToken(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('cx_token', token);
    setAuthToken(token);
    setUser(userData);
    setError('');
  };

  const logout = () => {
    localStorage.removeItem('cx_token');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
