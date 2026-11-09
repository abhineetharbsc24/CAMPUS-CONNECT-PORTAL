import { createContext, useContext, useState } from 'react';
import { loginRequest, registerRequest } from '../services/api.js';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('ccp_user'));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const persist = ({ token, user: nextUser }) => {
    localStorage.setItem('ccp_token', token);
    localStorage.setItem('ccp_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const login = async (credentials) => {
    const { data } = await loginRequest(credentials);
    return persist(data);
  };

  const register = async (details) => {
    const { data } = await registerRequest(details);
    return persist(data);
  };

  const logout = () => {
    localStorage.removeItem('ccp_token');
    localStorage.removeItem('ccp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
