import { useContext } from 'react';
import { AuthContext } from './authContextDefinition';
import type { AuthContextType } from '../types/user';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
