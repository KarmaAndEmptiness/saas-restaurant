import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';

// 路由守卫组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        {/* TODO: Add your main layout component here */}
        <div>Main Layout</div>
      </PrivateRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      // Add more protected routes here
    ],
  },
]); 