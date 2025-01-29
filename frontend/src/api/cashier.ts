import request from '../utils/request';

// 会员信息接口定义
export interface Member {
  id?: string;           // 会员ID（可选，创建时不需要）
  name: string;          // 会员姓名
  phone: string;         // 手机号码
  email?: string;        // 电子邮箱（可选）
  birthday?: string;     // 生日（可选）
  gender?: 'male' | 'female' | 'other';  // 性别（可选）
  points?: number;       // 会员积分（可选）
  level?: string;        // 会员等级（可选）
}

// 交易信息接口定义
export interface Transaction {
  id?: string;          // 交易ID（可选，创建时不需要）
  memberId: string;      // 会员ID
  amount: number;        // 交易金额
  type: 'consumption' | 'recharge';  // 交易类型：消费或充值
  paymentMethod: 'cash' | 'wechat' | 'alipay' | 'card'; // 支付方式
  items?: Array<{        // 交易项目明细（可选）
    id: string;          // 商品ID
    name: string;        // 商品名称
    quantity: number;    // 数量
    price: number;       // 单价
  }>;
  usePoints?: number;    // 使用的积分数量（可选）
  earnPoints?: number;   // 获得的积分数量（可选）
  createdAt?: string;    // 交易时间（可选，创建时不需要）
}

// 积分操作接口定义
interface PointsOperation {
  memberId: string;      // 会员ID
  points: number;        // 积分数量
  type: 'earn' | 'redeem';  // 操作类型：赚取或兑换
  description: string;   // 操作说明
}

// 会员注册相关API
export const registerMember = (data: Member) => {
  return request('/cashier/members', {
    method: 'POST',
    data,
  });
};

export const updateMember = (id: string, data: Partial<Member>) => {
  return request(`/cashier/members/${id}`, {
    method: 'PUT',
    data,
  });
};

export const getMember = (id: string) => {
  return request(`/cashier/members/${id}`, {
    method: 'GET',
  });
};

export const searchMembers = (query: string) => {
  return request('/cashier/members/search', {
    method: 'GET',
    params: { query },
  });
};

// 交易相关API
export const createTransaction = (data: Transaction) => {
  return request('/cashier/transactions', {
    method: 'POST',
    data,
  });
};

export const getTransactionHistory = (memberId: string) => {
  return request('/cashier/transactions', {
    method: 'GET',
    params: { memberId },
  });
};

export const getTransactionDetails = (id: string) => {
  return request(`/cashier/transactions/${id}`, {
    method: 'GET',
  });
};

// 积分管理相关API
export const getPointsBalance = (memberId: string) => {
  return request(`/cashier/points/${memberId}/balance`, {
    method: 'GET',
  });
};

export const operatePoints = (data: PointsOperation) => {
  return request('/cashier/points/operate', {
    method: 'POST',
    data,
  });
};

export const getPointsHistory = (memberId: string) => {
  return request(`/cashier/points/${memberId}/history`, {
    method: 'GET',
  });
}; 
