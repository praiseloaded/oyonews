'use client'; // Important if using React hooks (optional in Pages Router but safe)

import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const tokenRes = await fetch('https://api.oyonews.com.ng/wp-json/jwt-auth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.token) {
      throw new Error(tokenData.message || 'Invalid credentials');
    }

    const userRes = await fetch('https://api.oyonews.com.ng/wp-json/wp/v2/users/me', {
      headers: { Authorization: `Bearer ${tokenData.token}` },
    });

    const userData = await userRes.json();
    if (!userRes.ok || !userData.id) {
      throw new Error(userData.message || 'Failed to fetch user info');
    }

    const user: User = {
      id: userData.id,
      name: userData.name || userData.username,
      email: userData.email || '',
      role: userData.roles?.[0] || 'subscriber',
    };

    setUser(user);
    setToken(tokenData.token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', tokenData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
