import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/home" replace />;
  }

  return children;
}; 