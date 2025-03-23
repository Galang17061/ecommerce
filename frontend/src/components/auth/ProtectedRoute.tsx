import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface VerifyResponse {
  valid: boolean;
  message?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const { data } = await axios.get<VerifyResponse>(
          'http://localhost:8080/api/auth/verify',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setIsAuthenticated(data.valid);
        
        if (!data.valid) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with the attempted location stored
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 