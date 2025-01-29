// src/mocks/db.ts
import { factory, primaryKey } from '@mswjs/data';

export const db = factory({
  // 用户管理
  user: {
    id: primaryKey(String),
    username: String,
    password: String,
    name: String,
    role: String,
    email: String,
    status: String,
  },
  
  // 员工管理（管理人员后台）
  staff: {
    id: primaryKey(String),
    name: String,
    role: String, // 'admin' | 'cashier' | 'finance' | 'marketing'
    email: String,
  },
  
  // 会员数据（收银前台）
  member: {
    id: primaryKey(String),
    phone: String,
    balance: Number,
    points: Number,
  },
  
  // 订单记录（收银/财务）
  order: {
    id: primaryKey(String),
    memberId: String,
    amount: Number,
    status: String,
  },
  
  // 营销活动（会员营销）
  campaign: {
    id: primaryKey(String),
    title: String,
    type: String, // 'discount' | 'coupon',
    rules: Object, // 如 { threshold: 100, discount: 20 }
  },
});

// 添加默认用户
db.user.create({
  id: '1',
  username: 'admin',
  password: '123456',
  name: '管理员',
  role: 'admin',
  email: 'admin@example.com',
  status: 'active',
});