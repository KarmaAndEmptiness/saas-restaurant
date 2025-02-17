import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, 
  // theme,
   Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  TeamOutlined,
  KeyOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import {useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import * as authApi from '@/api/auth';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const Logo = styled.div`
  height: 64px;
  padding: 16px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  overflow: hidden;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: white;
  border-radius: 4px;
  min-height: 280px;
`;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // const {
  //   token: { colorPrimary },
  // } = theme.useToken();

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      key: '/admin/staff',
      icon: <TeamOutlined />,
      label: '员工管理',
    },
    {
      key: '/admin/permissions',
      icon: <KeyOutlined />,
      label: '权限管理',
    },
    {
      key: '/admin/logs',
      icon: <FileTextOutlined />,
      label: '系统日志',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <StyledLayout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Logo>{collapsed ? '后台' : '智慧餐饮管理后台'}</Logo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <HeaderRight>
            <Button
              type="text"
              icon={<BellOutlined />}
              onClick={() => navigate('/admin/notifications')}
            />
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => {
                  if (key === 'logout') {
                    handleLogout();
                  } else if (key === 'profile') {
                    navigate('/admin/profile');
                  }
                },
              }}
            >
              <Avatar icon={<UserOutlined />} />
            </Dropdown>
          </HeaderRight>
        </StyledHeader>
        <StyledContent>
          {children}
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default AdminLayout; 