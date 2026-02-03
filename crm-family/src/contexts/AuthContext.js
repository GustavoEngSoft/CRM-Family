import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthAPI, TokenService } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = TokenService.getUser();
    const storedToken = TokenService.getToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const data = await AuthAPI.login(email, senha);
      setUser(data.user);
      setToken(data.token);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (nome, email, senha) => {
    try {
      const data = await AuthAPI.register(nome, email, senha);
      setUser(data.user);
      setToken(data.token);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    AuthAPI.logout();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = () => {
    return !!user && !!token && !!TokenService.getToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
