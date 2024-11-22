import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}; 