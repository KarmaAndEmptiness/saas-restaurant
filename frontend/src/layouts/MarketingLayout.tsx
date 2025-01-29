import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, theme } from 'antd';
import {
  UserOutlined,
  PieChartOutlined,
  GiftOutlined,
  RiseOutlined,
  BellOutlined,
  LogoutOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const MarketingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: 'analysis',
      icon: <PieChartOutlined />,
      label: '会员分析',
    },
    {
      key: 'campaigns',
      icon: <GiftOutlined />,
      label: '活动管理',
    },
    {
      key: 'effects',
      icon: <RiseOutlined />,
      label: '效果分析',
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
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    navigate(`/marketing/${e.key}`);
  };

  const handleUserMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 24px', 
        background: token.colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold',
          color: token.colorPrimary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <ShopOutlined />
          会员营销中心
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Badge count={3} size="small">
            <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
            <Avatar style={{ cursor: 'pointer', backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: token.colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['analysis']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{
            padding: 24,
            margin: 0,
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            minHeight: 280,
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MarketingLayout; 