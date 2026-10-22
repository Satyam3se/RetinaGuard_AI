import React, { useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types/user';
import { AuthContext } from './authContextDefinition';

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'USR-8821',
  name: 'Sunita Devi',
  email: 'sunita.devi@retinaguard.icmr.in',
  role: 'vision_technician',
  healthCenter: 'Primary Health Centre Malur',
  district: 'Kolar',
  state: 'Karnataka',
  abhaHealthProfessionalId: 'HP-91-8841-2091',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('retinaguard_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_DEMO_USER;
      }
    }
    // Default logged in demo user for immediate prototype exploration
    return DEFAULT_DEMO_USER;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('retinaguard_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('retinaguard_user');
    }
  }, [user]);

  const login = async (email: string, role: UserRole = 'vision_technician'): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const newUser: UserProfile = {
      ...DEFAULT_DEMO_USER,
      email,
      role,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Healthcare Officer',
    };
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('retinaguard_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
