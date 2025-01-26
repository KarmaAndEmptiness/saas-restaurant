import axios from 'axios';
import type { AxiosResponse } from 'axios';

// 创建axios实例（统一配置）
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 从环境变量读取基础URL
  timeout: 10000, // 请求超时时间
});

// 类型定义
interface LoginParams {
  role: string;
  username: string;
  password: string;
  captcha: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

interface CaptchaResponse {
  image: string; // Base64格式的验证码图片
  captchaId: string; // 验证码ID（用于校验）
}

// 登录接口
export const loginAPI = (params: LoginParams): Promise<AxiosResponse<LoginResponse>> => {
  return http.post('/auth/login', params);
};

// 获取验证码接口
export const getCaptchaAPI = (): Promise<AxiosResponse<CaptchaResponse>> => {
  return http.get('/auth/captcha');
};

// （可选）其他认证相关接口...

// 请求拦截器（例如：添加Token）
http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器（例如：统一错误处理）
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
