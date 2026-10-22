import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-xs text-[#000000] uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-[#000000] animate-ping" />
          Authenticating Staff Session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login preserving the attempted target path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

