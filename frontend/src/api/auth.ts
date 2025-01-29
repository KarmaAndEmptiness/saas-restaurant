import request from '@/utils/request';

export interface LoginParams {
  username: string;
  password: string;
  captcha: string;
  sessionId: string;
  remember?: boolean;
}

export interface LoginResult {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
  };
}

export interface CaptchaResult {
  sessionId: string;
  captchaUrl: string;
}

/**
 * 获取验证码
 */
export async function getCaptcha(): Promise<CaptchaResult> {
  return request.get('/auth/captcha');
}

/**
 * 用户登录
 */
export async function login(params: LoginParams): Promise<LoginResult> {
  return request.post('/auth/login', params);
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  return request.post('/auth/logout');
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser() {
  return request.get('/auth/user');
}

/**
 * 刷新 Token
 */
export async function refreshToken() {
  return request.post('/auth/refresh-token');
}

/**
 * 重置密码
 */
export async function resetPassword(params: { email: string }) {
  return request.post('/auth/reset-password', params);
} 