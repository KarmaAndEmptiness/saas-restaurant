import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import Login from '../pages/auth/Login';

// 懒加载各个布局和页面组件
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const CashierLayout = lazy(() => import('../layouts/CashierLayout'));
const FinanceLayout = lazy(() => import('../layouts/FinanceLayout'));
const MarketingLayout = lazy(() => import('../layouts/MarketingLayout'));

// 管理后台页面
const StaffManagement = lazy(() => import('../pages/admin/StaffManagement'));
const PermissionManagement = lazy(() => import('../pages/admin/PermissionManagement'));
const SystemLogs = lazy(() => import('../pages/admin/SystemLogs'));

// 收银前台页面
const MemberRegistration = lazy(() => import('../pages/cashier/MemberRegistration'));
const Transaction = lazy(() => import('../pages/cashier/Transaction'));
const PointsManagement = lazy(() => import('../pages/cashier/PointsManagement'));

// 财务中心页面
const FinancialStatistics = lazy(() => import('../pages/finance/FinancialStatistics'));
const StoreSettlement = lazy(() => import('../pages/finance/StoreSettlement'));
const CustomReports = lazy(() => import('../pages/finance/CustomReports'));

// 会员营销页面
const MemberAnalysis = lazy(() => import('../pages/marketing/MemberAnalysis'));
const CampaignManagement = lazy(() => import('../pages/marketing/CampaignManagement'));
const EffectAnalysis = lazy(() => import('../pages/marketing/EffectAnalysis'));

// 加载组件
const LoadingComponent = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

// 路由守卫组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // 从localStorage获取用户角色

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 根据角色重定向到对应的子系统首页
  if (!window.location.pathname.includes(userRole as string)) {
    const roleDefaultPaths: Record<string, string> = {
      admin: '/admin/staff',
      cashier: '/cashier/transaction',
      finance: '/finance/statistics',
      marketing: '/marketing/analysis',
    };
    return <Navigate to={roleDefaultPaths[userRole as string] || '/login'} replace />;
  }

  return <Suspense fallback={<LoadingComponent />}>{children}</Suspense>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: 'staff',
        element: <StaffManagement />,
      },
      {
        path: 'permissions',
        element: <PermissionManagement />,
      },
      {
        path: 'logs',
        element: <SystemLogs />,
      },
      {
        path: '',
        element: <Navigate to="staff" replace />,
      },
    ],
  },
  {
    path: '/cashier',
    element: (
      <PrivateRoute>
        <CashierLayout>
          <Outlet />
        </CashierLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: 'member',
        element: <MemberRegistration />,
      },
      {
        path: 'transaction',
        element: <Transaction />,
      },
      {
        path: 'points',
        element: <PointsManagement />,
      },
      {
        path: '',
        element: <Navigate to="transaction" replace />,
      },
    ],
  },
  {
    path: '/finance',
    element: (
      <PrivateRoute>
        <FinanceLayout>
          <Outlet />
        </FinanceLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: 'statistics',
        element: <FinancialStatistics />,
      },
      {
        path: 'settlement',
        element: <StoreSettlement />,
      },
      {
        path: 'reports',
        element: <CustomReports />,
      },
      {
        path: '',
        element: <Navigate to="statistics" replace />,
      },
    ],
  },
  {
    path: '/marketing',
    element: (
      <PrivateRoute>
        <MarketingLayout>
          <Outlet />
        </MarketingLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: 'analysis',
        element: <MemberAnalysis />,
      },
      {
        path: 'campaigns',
        element: <CampaignManagement />,
      },
      {
        path: 'effects',
        element: <EffectAnalysis />,
      },
      {
        path: '',
        element: <Navigate to="analysis" replace />,
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
]); 