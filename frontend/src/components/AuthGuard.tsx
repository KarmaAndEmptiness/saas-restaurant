import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token'); // 或其他验证方式

  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
