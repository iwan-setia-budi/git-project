import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute component to protect routes that require authentication
 * Redirects to login if not authenticated
 */
export default function PrivateRoute({ children, isAuthenticated = true }) {
  // TODO: Replace with actual authentication check
  // const isAuthenticated = !!localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
