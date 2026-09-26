import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('branplate_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.user?.type !== 'admin') throw new Error('Administrator access required');
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('branplate_admin', JSON.stringify(data.user));
    setAdmin(data.user);
    return data;
  };

  const signup = async (email, password, bootstrapPassword) => {
    const { data } = await api.post('/admin/auth/signup', { email, password, bootstrapPassword });
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('branplate_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('branplate_admin');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, signup, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
