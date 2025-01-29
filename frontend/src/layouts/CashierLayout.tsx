import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, theme } from 'antd';
import {
  UserOutlined,
  BellOutlined,
  CreditCardOutlined,
  TeamOutlined,
  GiftOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const CashierLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: 'transaction',
      icon: <CreditCardOutlined />,
      label: '交易管理',
    },
    {
      key: 'member',
      icon: <TeamOutlined />,
      label: '会员注册',
    },
    {
      key: 'points',
      icon: <GiftOutlined />,
      label: '积分管理',
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
    navigate(`/cashier/${e.key}`);
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
        }}>
          智慧餐饮收银系统
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Badge count={5} size="small">
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
            defaultSelectedKeys={['transaction']}
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

export default CashierLayout; 