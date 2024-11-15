import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PrivateRouter = () => {
  const { user, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
}; 