import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuthStore } from "../../lib/store/authStore";
import {
  getDefaultRouteForRole,
  hasAllowedRole,
  type UserRole,
} from "../../lib/auth";

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!hasAllowedRole(user, allowedRoles)) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return children;
};
