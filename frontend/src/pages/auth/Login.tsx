import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Space } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import * as authApi from '@/api/auth';
import type { LoginParams } from '@/api/auth';
interface LoginForm extends LoginParams {
  remember?: boolean;
}

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #1677ff 0%, #36cfc9 50%, #0958d9 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
    top: -50%;
    left: -50%;
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 440px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  
  .ant-card-head {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .ant-card-head-title {
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    color: #1677ff;
    padding: 24px 0 12px;
  }

  .ant-card-body {
    padding: 32px;
  }
`;

const StyledForm = styled(Form<LoginForm>)`
  .ant-input-affix-wrapper {
    border-radius: 8px;
    height: 46px;
    padding: 8px 16px;
    
    .anticon {
      color: #bfbfbf;
    }
  }

  .ant-input-affix-wrapper-focused,
  .ant-input-affix-wrapper:hover {
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
  }

  .login-form-button {
    width: 100%;
    height: 46px;
    border-radius: 8px;
    font-size: 16px;
    margin-top: 8px;
  }
  
  .ant-form-item:last-child {
    margin-bottom: 0;
  }

  .captcha-container {
    display: flex;
    gap: 12px;
    
    .ant-input-affix-wrapper {
      flex: 1;
    }
    
    .captcha-img {
      height: 46px;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid #d9d9d9;
    }
  }
`;

const SystemTitle = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    color: #1677ff;
    margin: 0;
    font-weight: 600;
  }
  
  p {
    color: #666;
    margin: 8px 0 0;
    font-size: 16px;
  }
`;



const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [sessionId, setSessionId] = useState('');

  const [form] = Form.useForm<LoginForm>();

  const refreshCaptcha = async () => {
    try {
      const { data } = await authApi.getCaptcha();
      setCaptchaUrl(data.captchaUrl);
      setSessionId(data.sessionId);
    } catch (error) {
      console.log(error);
      message.error('获取验证码失败，请刷新页面重试');
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true);
      const { data } = await authApi.login({
        ...values,
        sessionId,
      });

      // 存储认证信息
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);

      message.success('登录成功');

      // 根据角色跳转到对应的子系统
      const roleDefaultPaths: Record<string, string> = {
        admin: '/admin/staff',
        cashier: '/cashier/transaction',
        finance: '/finance/statistics',
        marketing: '/marketing/analysis',
      };

      navigate(roleDefaultPaths[data.user.role] || '/login');
    } catch (error) {
      console.log(error);
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <SystemTitle>
          <h1>智慧餐饮管理系统</h1>
          <p>Smart Restaurant Management System</p>
        </SystemTitle>

        <StyledForm
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="captcha"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div className="captcha-container">
              <Input
                prefix={<SafetyOutlined />}
                placeholder="请输入验证码"
                size="large"
              />
              <img
                src={captchaUrl}
                alt="验证码"
                className="captcha-img"
                onClick={refreshCaptcha}
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a href="/forgot-password" style={{ color: '#1677ff' }}>忘记密码？</a>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
              size="large"
            >
              {loading ? '登录中...' : '登 录'}
            </Button>
          </Form.Item>
        </StyledForm>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 