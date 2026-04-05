import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/services/authService";

/**
 * PrivateRoute component to protect routes that require authentication
 * Redirects to login if not authenticated
 */
export default function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
