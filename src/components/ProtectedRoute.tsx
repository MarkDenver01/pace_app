import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Allow public routes without requiring authentication
  const publicRoutes = ["/apk-uploads"];
  if (publicRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  //  Protect all other routes
  if (!isAuthenticated || !user?.role) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
