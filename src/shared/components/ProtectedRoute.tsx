import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../application/state/AuthContext';
import { UserRole } from '../../domain/models/User';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && session && !allowedRoles.includes(session.role)) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center max-w-lg mx-auto mt-12">
        <h2 className="text-lg font-bold text-amber-900 mb-2">Acceso Restringido</h2>
        <p className="text-sm text-amber-700">
          No tienes permisos para acceder a esta sección. Esta funcionalidad está reservada para usuarios con rol{' '}
          <span className="font-semibold">{allowedRoles.join(' / ')}</span>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
