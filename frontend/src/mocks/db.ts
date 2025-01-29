// src/mocks/db.ts
import { factory, primaryKey, nullable } from '@mswjs/data';
import dayjs from 'dayjs';

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
    phone: String,
    status: String,
    department: String,
    joinDate: String,
  },

  // 角色管理
  role: {
    id: primaryKey(String),
    name: String,
    description: String,
    permissions: Array,
    userCount: Number,
  },

  // 权限管理
  permission: {
    id: primaryKey(String),
    name: String,
    code: String,
    description: String,
    type: String, // 'menu' | 'operation'
  },

  // 系统日志
  log: {
    id: primaryKey(String),
    timestamp: String,
    type: String, // 'info' | 'warning' | 'error' | 'success'
    action: String,
    operator: String,
    operatorRole: String,
    ip: String,
    details: String,
  },

  // 会员数据（收银前台）
  member: {
    id: primaryKey(String),
    name: String,
    phone: String,
    email: String,
    gender: String,
    birthday: String,
    status: String,
    createTime: String,
  },

  // 订单记录（收银/财务）
  order: {
    id: primaryKey(String),
    memberId: String,
    amount: Number,
    status: String,
  },

  // 营销活动
  campaign: {
    id: primaryKey(String),
    name: String,
    description: String,
    type: String,
    startDate: String,
    endDate: String,
    status: String,
    rules: Object,
  },

  // 活动效果数据
  campaignEffect: {
    id: primaryKey(String),
    campaignId: String,
    date: String,
    uv: Number,
    pv: Number,
    conversion: Number,
  },

  // 转化指标
  conversionMetric: {
    id: primaryKey(String),
    campaignId: String,
    campaignName: String,
    conversion: Number,
    participantCount: Number,
    totalRevenue: Number,
  },

  // 会员分析数据
  memberAnalytics: {
    id: primaryKey(String),
    date: String,
    totalMembers: Number,
    newMembers: Number,
    activeMembers: Number,
    inactiveMembers: Number,
  },

  // 会员增长趋势
  memberGrowth: {
    id: primaryKey(String),
    date: String,
    count: Number,
  },

  // 门店管理
  store: {
    id: primaryKey(String),
    name: String,
    address: String,
    phone: String,
  },

  // 销售记录
  sale: {
    id: primaryKey(String),
    date: String,
    amount: Number,
    type: String,
  },

  // 支付记录
  payment: {
    id: primaryKey(String),
    method: String,
    amount: Number,
    percentage: Number,
  },

  // 每日记录
  dailyRecord: {
    id: primaryKey(String),
    date: String,
    totalSales: Number,
    orderCount: Number,
    averageOrder: Number,
    profit: Number,
    growth: Object, // { sales: number, orders: number }
  },

  // 结算记录
  settlement: {
    id: primaryKey(String),
    storeId: String,
    storeName: String,
    period: Object, // { start: string, end: string }
    totalAmount: Number,
    settledAmount: Number,
    commission: Number,
    status: String, // 'pending' | 'completed'
    items: Array, // [{ date: string, amount: number, commission: number, bankAccount: string, bankName: string, remark: string }]
  },

  // 报表配置
  reportConfig: {
    id: primaryKey(String),
    name: String,
    type: String,
    metrics: Array,
    filters: Object,
    schedule: nullable(Object),
  },

  // 积分账户
  points: {
    id: primaryKey(String),
    memberId: String,
    balance: Number,
  },

  // 积分历史记录
  pointsHistory: {
    id: primaryKey(String),
    memberId: String,
    type: String,
    points: Number,
    balance: Number,
    description: String,
    createTime: String,
    operator: String,
  },

  // 交易记录
  transaction: {
    id: primaryKey(String),
    memberId: String,
    amount: Number,
    type: String,
    paymentMethod: String,
    items: Array,
    usePoints: Number,
    createTime: String,
    status: String,
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
db.user.create({
  id: '2',
  username:'cashier',
  password:'123456',
  name:'收银员',
  role:'cashier',
  email:'cashier@example.com',
  status:'active',
});
db.user.create({
  id: '3',
  username:'finance',
  password:'123456',
  name:'财务主管',
  role:'finance',
  email:'finance@example.com',
  status:'active',
});
db.user.create({
  id: '4',
  username:'marketing',
  password:'123456',
  name:'营销经理',
  role:'marketing',
  email:'marketing@example.com',
  status:'active',
});

// 添加默认角色
db.role.create({
  id: '1',
  name: '超级管理员',
  description: '系统最高权限角色',
  permissions: ['system:all', 'staff:manage', 'finance:manage', 'marketing:manage'],
  userCount: 1,
});

db.role.create({
  id: '2',
  name: '收银员',
  description: '负责前台收银操作',
  permissions: ['cashier:basic', 'member:view'],
  userCount: 3,
});

db.role.create({
  id: '3',
  name: '财务主管',
  description: '负责财务管理',
  permissions: ['finance:manage', 'report:view'],
  userCount: 2,
});

db.role.create({
  id: '4',
  name: '营销经理',
  description: '负责会员营销',
  permissions: ['marketing:manage', 'member:manage'],
  userCount: 2,
});

// 添加默认权限
db.permission.create({
  id: '1',
  name: '系统管理',
  code: 'system:all',
  description: '系统所有权限',
  type: 'menu',
});

db.permission.create({
  id: '2',
  name: '员工管理',
  code: 'staff:manage',
  description: '员工管理权限',
  type: 'menu',
});

db.permission.create({
  id: '3',
  name: '财务管理',
  code: 'finance:manage',
  description: '财务管理权限',
  type: 'menu',
});

db.permission.create({
  id: '4',
  name: '营销管理',
  code: 'marketing:manage',
  description: '营销管理权限',
  type: 'menu',
});

db.permission.create({
  id: '5',
  name: '收银操作',
  code: 'cashier:basic',
  description: '基础收银功能',
  type: 'operation',
});

db.permission.create({
  id: '6',
  name: '会员查看',
  code: 'member:view',
  description: '查看会员信息',
  type: 'operation',
});

db.permission.create({
  id: '7',
  name: '会员管理',
  code: 'member:manage',
  description: '管理会员信息',
  type: 'operation',
});

db.permission.create({
  id: '8',
  name: '报表查看',
  code: 'report:view',
  description: '查看报表信息',
  type: 'operation',
});

// 添加示例日志
db.log.create({
  id: '1',
  timestamp: new Date().toISOString(),
  type: 'info',
  action: '用户登录',
  operator: 'admin',
  operatorRole: '超级管理员',
  ip: '192.168.1.1',
  details: '管理员登录系统',
});

db.log.create({
  id: '2',
  timestamp: new Date().toISOString(),
  type: 'warning',
  action: '权限变更',
  operator: 'admin',
  operatorRole: '超级管理员',
  ip: '192.168.1.1',
  details: '修改用户权限配置',
});

// 添加门店数据
db.store.create({
  id: '1',
  name: '总店',
  address: '北京市朝阳区',
  phone: '010-12345678',
});

db.store.create({
  id: '2',
  name: '分店1',
  address: '北京市海淀区',
  phone: '010-87654321',
});

db.store.create({
  id: '3',
  name: '分店2',
  address: '北京市西城区',
  phone: '010-11112222',
});

// 添加销售记录
db.sale.create({
  id: '1',
  date: '2024-01-01',
  amount: 15000,
  type: '餐饮收入',
});

db.sale.create({
  id: '2',
  date: '2024-01-02',
  amount: 18000,
  type: '餐饮收入',
});

db.sale.create({
  id: '3',
  date: '2024-01-03',
  amount: 12000,
  type: '餐饮收入',
});

db.sale.create({
  id: '4',
  date: '2024-01-01',
  amount: 8000,
  type: '外卖收入',
});

db.sale.create({
  id: '5',
  date: '2024-01-02',
  amount: 9500,
  type: '外卖收入',
});

db.sale.create({
  id: '6',
  date: '2024-01-03',
  amount: 7500,
  type: '外卖收入',
});

// 添加每日记录
db.dailyRecord.create({
  id: '1',
  date: '2024-01-01',
  totalSales: 23000,
  orderCount: 230,
  averageOrder: 100,
  profit: 6900,
  growth: { sales: 15, orders: 12 },
});

db.dailyRecord.create({
  id: '2',
  date: '2024-01-02',
  totalSales: 27500,
  orderCount: 275,
  averageOrder: 100,
  profit: 8250,
  growth: { sales: 8, orders: 6 },
});

db.dailyRecord.create({
  id: '3',
  date: '2024-01-03',
  totalSales: 19500,
  orderCount: 195,
  averageOrder: 100,
  profit: 5850,
  growth: { sales: -2, orders: -4 },
});

db.dailyRecord.create({
  id: '4',
  date: '2024-01-04',
  totalSales: 25000,
  orderCount: 250,
  averageOrder: 100,
  profit: 7500,
  growth: { sales: 5, orders: 3 },
});

db.dailyRecord.create({
  id: '5',
  date: '2024-01-05',
  totalSales: 28000,
  orderCount: 280,
  averageOrder: 100,
  profit: 8400,
  growth: { sales: 10, orders: 8 },
});

db.dailyRecord.create({
  id: '6',
  date: '2024-01-06',
  totalSales: 24000,
  orderCount: 240,
  averageOrder: 100,
  profit: 7200,
  growth: { sales: -3, orders: -2 },
});

db.dailyRecord.create({
  id: '7',
  date: '2024-01-07',
  totalSales: 26000,
  orderCount: 260,
  averageOrder: 100,
  profit: 7800,
  growth: { sales: 6, orders: 4 },
});

// 添加结算记录
db.settlement.create({
  id: '1',
  storeId: '1',
  storeName: '总店',
  period: { start: '2024-01-01', end: '2024-01-31' },
  totalAmount: 150000,
  settledAmount: 142500,
  commission: 7500,
  status: 'pending',
  items: [
    { 
      date: '2024-01-01', 
      amount: 50000, 
      commission: 2500,
      bankAccount: '6222021234567890123',
      bankName: '中国工商银行',
      remark: '1月份第一周结算'
    },
    { 
      date: '2024-01-02', 
      amount: 60000, 
      commission: 3000,
      bankAccount: '6222021234567890123',
      bankName: '中国工商银行',
      remark: '1月份第二周结算'
    },
    { 
      date: '2024-01-03', 
      amount: 40000, 
      commission: 2000,
      bankAccount: '6222021234567890123',
      bankName: '中国工商银行',
      remark: '1月份第三周结算'
    },
  ],
});

db.settlement.create({
  id: '2',
  storeId: '2',
  storeName: '分店1',
  period: { start: '2024-01-01', end: '2024-01-31' },
  totalAmount: 120000,
  settledAmount: 114000,
  commission: 6000,
  status: 'completed',
  items: [
    { 
      date: '2024-01-01', 
      amount: 40000, 
      commission: 2000,
      bankAccount: '6222021234567890456',
      bankName: '中国建设银行',
      remark: '1月份第一周结算'
    },
    { 
      date: '2024-01-02', 
      amount: 45000, 
      commission: 2250,
      bankAccount: '6222021234567890456',
      bankName: '中国建设银行',
      remark: '1月份第二周结算'
    },
    { 
      date: '2024-01-03', 
      amount: 35000, 
      commission: 1750,
      bankAccount: '6222021234567890456',
      bankName: '中国建设银行',
      remark: '1月份第三周结算'
    },
  ],
});
db.settlement.create({
  id: '3',
  storeId: '3',
  storeName: '分店2',
  period: { start: '2025-01-01', end: '2025-01-31' },
  totalAmount: 120000,
  settledAmount: 114000,
  commission: 6000,
  status: 'completed',
  items: [
    { 
      date: '2025-01-01', 
      amount: 40000, 
      commission: 2000,
      bankAccount: '6222021234567890456',
      bankName: '中国建设银行',
      remark: '1月份第一周结算'
    },
    { 
      date: '2025-01-02', 
      amount: 45000, 
      commission: 2250,
      bankAccount: '6222021234567890456',
      bankName: '中国建设银行',
      remark: '1月份第二周结算'
    },
    { 
      date: '2025-01-03', 
      amount: 35000, 
      commission: 1750,
      bankAccount: '6222021234567890456',
      bankName: '中国建设银行',
      remark: '1月份第三周结算'
    }
  ],
});

// 添加示例报表配置
db.reportConfig.create({
  id: '1',
  name: '销售汇总报表',
  type: 'revenue',
  metrics: ['date', 'store', 'amount', 'count'],
  filters: {
    dateRange: true,
    store: true,
    category: false,
    paymentMethod: false,
  },
  schedule: null,
});

db.reportConfig.create({
  id: '2',
  name: '支付方式分析',
  type: 'custom',
  metrics: ['date', 'paymentMethod', 'amount'],
  filters: {
    dateRange: true,
    store: true,
    category: false,
    paymentMethod: true,
  },
  schedule: null,
});

db.reportConfig.create({
  id: '3',
  name: '商品类别统计',
  type: 'custom',
  metrics: ['category', 'amount', 'count'],
  filters: {
    dateRange: true,
    store: true,
    category: true,
    paymentMethod: false,
  },
  schedule: null,
});

// 添加支付方式记录
db.payment.create({
  id: '1',
  method: '微信支付',
  amount: 8000,
  percentage: 40,
});

db.payment.create({
  id: '2',
  method: '支付宝',
  amount: 6000,
  percentage: 30,
});

db.payment.create({
  id: '3',
  method: '现金',
  amount: 4000,
  percentage: 20,
});

db.payment.create({
  id: '4',
  method: '银行卡',
  amount: 2000,
  percentage: 10,
});

// 添加示例会员数据
db.member.create({
  id: '1',
  name: '张三',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  gender: 'male',
  birthday: '1990-01-01',
  status: 'active',
  createTime: '2024-01-01T00:00:00Z',
});

db.member.create({
  id: '2',
  name: '李四',
  phone: '13900139000',
  email: 'lisi@example.com',
  gender: 'female',
  birthday: '1995-02-02',
  status: 'active',
  createTime: '2024-01-02T00:00:00Z',
});

// 添加示例积分账户
db.points.create({
  id: '1',
  memberId: '1',
  balance: 1000,
});

db.points.create({
  id: '2',
  memberId: '2',
  balance: 500,
});

// 添加示例积分历史记录
db.pointsHistory.create({
  id: '1',
  memberId: '1',
  type: 'earn',
  points: 100,
  balance: 1000,
  description: '消费获得积分',
  createTime: '2024-01-01T10:00:00Z',
  operator: 'admin',
});

db.pointsHistory.create({
  id: '2',
  memberId: '1',
  type: 'redeem',
  points: -50,
  balance: 950,
  description: '积分兑换商品',
  createTime: '2024-01-02T14:30:00Z',
  operator: 'admin',
});

// 添加示例交易记录
db.transaction.create({
  id: '1',
  memberId: '1',
  amount: 199.99,
  type: 'consumption',
  paymentMethod: 'wechat',
  items: [
    { id: 'ITEM1', name: '商品1', quantity: 2, price: 99.99 }
  ],
  usePoints: 0,
  createTime: '2024-01-01T15:30:00Z',
  status: 'completed',
});

db.transaction.create({
  id: '2',
  memberId: '2',
  amount: 299.99,
  type: 'consumption',
  paymentMethod: 'alipay',
  items: [
    { id: 'ITEM2', name: '商品2', quantity: 1, price: 299.99 }
  ],
  usePoints: 100,
  createTime: '2024-01-02T16:45:00Z',
  status: 'completed',
});

// 添加示例营销活动
db.campaign.create({
  id: '1',
  name: '新春特惠活动',
  description: '春节期间全场商品8折优惠',
  type: 'discount',
  startDate: '2024-02-01',
  endDate: '2024-02-15',
  status: 'active',
  rules: {
    targetAudience: ['all'],
    discount: 20,
    participantCount: 150,
    conversionRate: 0.35,
  },
});

db.campaign.create({
  id: '2',
  name: '会员积分翻倍',
  description: '消费即可获得双倍积分',
  type: 'points',
  startDate: '2024-01-15',
  endDate: '2024-02-15',
  status: 'active',
  rules: {
    targetAudience: ['gold', 'silver'],
    discount: 0,
    participantCount: 80,
    conversionRate: 0.45,
  },
});

db.campaign.create({
  id: '3',
  name: '生日特权月',
  description: '会员生日当月享受特别优惠',
  type: 'gift',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: 'active',
  rules: {
    targetAudience: ['gold'],
    discount: 15,
    participantCount: 45,
    conversionRate: 0.6,
  },
});

// 添加示例活动效果数据
for (let i = 0; i < 30; i++) {
  const date = dayjs().subtract(i, 'days').format('YYYY-MM-DD');
  db.campaignEffect.create({
    id: `effect_${i}_1`,
    campaignId: '1',
    date,
    uv: Math.floor(Math.random() * 500) + 500,
    pv: Math.floor(Math.random() * 1000) + 1000,
    conversion: Math.random() * 0.3 + 0.1,
  });
  
  db.campaignEffect.create({
    id: `effect_${i}_2`,
    campaignId: '2',
    date,
    uv: Math.floor(Math.random() * 300) + 300,
    pv: Math.floor(Math.random() * 600) + 600,
    conversion: Math.random() * 0.4 + 0.2,
  });
}

// 添加示例转化指标
db.conversionMetric.create({
  id: '1',
  campaignId: '1',
  campaignName: '新春特惠活动',
  conversion: 0.35,
  participantCount: 150,
  totalRevenue: 45000,
});

db.conversionMetric.create({
  id: '2',
  campaignId: '2',
  campaignName: '会员积分翻倍',
  conversion: 0.45,
  participantCount: 80,
  totalRevenue: 32000,
});

db.conversionMetric.create({
  id: '3',
  campaignId: '3',
  campaignName: '生日特权月',
  conversion: 0.6,
  participantCount: 45,
  totalRevenue: 18000,
});

// 添加示例会员分析数据
db.memberAnalytics.create({
  id: '1',
  date: dayjs().format('YYYY-MM-DD'),
  totalMembers: 1200,
  newMembers: 50,
  activeMembers: 800,
  inactiveMembers: 400,
});

// 添加示例会员增长趋势
for (let i = 0; i < 6; i++) {
  const date = dayjs().subtract(i, 'months').format('YYYY-MM-DD');
  db.memberGrowth.create({
    id: `growth_${i}`,
    date,
    count: Math.floor(Math.random() * 50) + 30,
  });
}