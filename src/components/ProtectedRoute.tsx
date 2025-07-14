// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";
//import { Navigate, useLocation } from "react-router-dom";
//import { useAuth } from "../context/AuthContext.tsx";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  // const { token, role } = useAuth();
  // const location = useLocation();
  //
  // if (!token) {
  //   return <Navigate to="/" replace />;
  // }
  //
  // if (role === "admin" && !location.pathname.startsWith("/admin")) {
  //   return <Navigate to="/admin/dashboard" replace />;
  // }
  //
  // if (role === "superadmin" && !location.pathname.startsWith("/superadmin")) {
  //   return <Navigate to="/superadmin/dashboard" replace />;
  // }
  //
  return children;
};

export default ProtectedRoute;


