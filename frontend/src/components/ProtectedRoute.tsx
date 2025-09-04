import React from 'react';
import { useAuth } from '../contexts';
import { Login } from './';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 dark:border-indigo-400 mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-300'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200'>
        <Login />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
