import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartpark_token');
    const stored = localStorage.getItem('smartpark_user');
    if (token && stored) {
      setUser(JSON.parse(stored));
      getMe().then(res => {
        setUser(res.data);
        localStorage.setItem('smartpark_user', JSON.stringify(res.data));
      }).catch(() => {
        localStorage.removeItem('smartpark_token');
        localStorage.removeItem('smartpark_user');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    localStorage.setItem('smartpark_token', data.token);
    localStorage.setItem('smartpark_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await apiRegister(formData);
    localStorage.setItem('smartpark_token', data.token);
    localStorage.setItem('smartpark_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('smartpark_token');
    localStorage.removeItem('smartpark_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('smartpark_user', JSON.stringify(updatedUser));
    if (updatedUser.token) localStorage.setItem('smartpark_token', updatedUser.token);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
