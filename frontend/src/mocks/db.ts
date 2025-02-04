// src/mocks/db.ts
import { factory, primaryKey, nullable } from '@mswjs/data';
export const db = factory({

  // 权限管理
  permission: {
    id: primaryKey(String), // 主键ID
    name: String, // 权限名称
    code: String, // 权限代码
    description: String, // 权限描述
    type: String, // 权限类型：'menu' | 'operation'
  },
  // 角色管理
  role: {
    id: primaryKey(String), // 主键ID
    name: String, // 角色名称
    description: String, // 角色描述
    permissions: Array, // 角色权限列表
    userCount: Number, // 用户数量
  },

  // 用户管理
  user: {
    id: primaryKey(String), // 主键ID
    username: String, // 用户名
    password: String, // 密码
    name: String, // 姓名
    role: String, // 角色
    email: String, // 邮箱
    status: String, // 状态
  },
  
  // 员工管理（管理人员后台）
  staff: {
    id: primaryKey(String), // 主键ID
    name: String, // 姓名
    role: String, // 角色：'admin' | 'cashier' | 'finance' | 'marketing'
    email: String, // 邮箱
    phone: String, // 电话
    status: String, // 状态
    department: String, // 部门
    joinDate: String, // 入职日期
  },

  // 系统日志
  log: {
    id: primaryKey(String), // 主键ID
    timestamp: String, // 时间戳
    type: String, // 日志类型：'info' | 'warning' | 'error' | 'success'
    action: String, // 操作
    operator: String, // 操作员
    operatorRole: String, // 操作员角色
    ip: String, // IP地址
    details: String, // 详情
  },

  // 会员数据（收银前台）
  member: {
    id: primaryKey(String), // 主键ID
    name: String, // 姓名
    phone: String, // 电话
    email: String, // 邮箱
    gender: String, // 性别
    birthday: String, // 生日
    status: String, // 状态
    createTime: String, // 创建时间
  },

  // 订单记录（收银/财务）
  order: {
    id: primaryKey(String), // 主键ID
    memberId: String, // 会员ID
    amount: Number, // 金额
    status: String, // 状态
  },

  // 营销活动
  campaign: {
    id: primaryKey(String), // 主键ID
    name: String, // 活动名称
    description: String, // 活动描述
    type: String, // 活动类型
    startDate: String, // 开始日期
    endDate: String, // 结束日期
    status: String, // 状态
    rules: Object, // 活动规则
  },

  // 活动效果数据
  campaignEffect: {
    id: primaryKey(String), // 主键ID
    campaignId: String, // 活动ID
    date: String, // 日期
    uv: Number, // 独立访客数
    pv: Number, // 页面浏览量
    conversion: Number, // 转化率
  },

  // 转化指标
  conversionMetric: {
    id: primaryKey(String), // 主键ID
    campaignId: String, // 活动ID
    campaignName: String, // 活动名称
    conversion: Number, // 转化率
    participantCount: Number, // 参与人数
    totalRevenue: Number, // 总收入
    date: String, // 日期
  },

  // 会员分析数据
  memberAnalytics: {
    id: primaryKey(String), // 主键ID
    date: String, // 日期
    totalMembers: Number, // 总会员数
    newMembers: Number, // 新增会员数
    activeMembers: Number, // 活跃会员数
    inactiveMembers: Number, // 不活跃会员数
  },

  // 会员增长趋势
  memberGrowth: {
    id: primaryKey(String), // 主键ID
    date: String, // 日期
    count: Number, // 数量
  },

  // 门店管理
  store: {
    id: primaryKey(String), // 主键ID
    name: String, // 门店名称
    address: String, // 地址
    phone: String, // 电话
  },

  // 销售记录
  sale: {
    id: primaryKey(String), // 主键ID
    date: String, // 日期
    amount: Number, // 金额
    type: String, // 类型
  },

  // 支付记录
  payment: {
    id: primaryKey(String), // 主键ID
    method: String, // 支付方式
    amount: Number, // 金额
    percentage: Number, // 百分比
  },

  // 每日记录
  dailyRecord: {
    id: primaryKey(String), // 主键ID
    date: String, // 日期
    totalSales: Number, // 总销售额
    orderCount: Number, // 订单数量
    averageOrder: Number, // 平均订单金额
    profit: Number, // 利润
    growth: Object, // 增长数据：{ sales: number, orders: number }
  },

  // 结算记录
  settlement: {
    id: primaryKey(String), // 主键ID
    storeId: String, // 门店ID
    storeName: String, // 门店名称
    period: Object, // 结算周期：{ start: string, end: string }
    totalAmount: Number, // 总金额
    settledAmount: Number, // 已结算金额
    commission: Number, // 佣金
    status: String, // 状态：'pending' | 'completed'
    items: Array, // 结算项列表：[{ date: string, amount: number, commission: number, bankAccount: string, bankName: string, remark: string }]
  },

  // 报表配置
  reportConfig: {
    id: primaryKey(String), // 主键ID
    name: String, // 报表名称
    type: String, // 报表类型
    metrics: Array, // 指标列表
    filters: Object, // 过滤条件
    schedule: nullable(Object), // 调度配置
  },

  // 积分账户
  points: {
    id: primaryKey(String), // 主键ID
    memberId: String, // 会员ID
    balance: Number, // 积分余额
  },

  // 积分历史记录
  pointsHistory: {
    id: primaryKey(String), // 主键ID
    memberId: String, // 会员ID
    type: String, // 类型
    points: Number, // 积分
    balance: Number, // 余额
    description: String, // 描述
    createTime: String, // 创建时间
    operator: String, // 操作员
  },

  // 交易记录
  transaction: {
    id: primaryKey(String), // 主键ID
    memberId: String, // 会员ID
    amount: Number, // 金额
    type: String, // 类型
    paymentMethod: String, // 支付方式
    items: Array, // 商品列表
    usePoints: Number, // 使用积分
    createTime: String, // 创建时间
    status: String, // 状态
  }
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

db.staff.create({
  id: '1',
  name: '张三',
  role: 'admin',
  email: 'zhangsan@example.com',
  phone: '12345678901',
  status: 'active',
  department: '管理部',
  joinDate: '2024-01-01',
});
db.staff.create({
  id: '2',
  name: '李四',
  role: 'cashier',
  email: 'lisi@example.com',
  phone: '12345678902',
  status: 'active',
  department: '财务部',
  joinDate: '2024-01-02',
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
  description: '春节期间全场商品8折优惠，新老顾客同享',
  type: 'discount',
  startDate: '2024-01-15',
  endDate: '2024-02-15',
  status: 'active',
  rules: {
    targetAudience: ['all'],
    discount: 20,
    participantCount: 1580,
    conversionRate: 35,
  },
});

db.campaign.create({
  id: '2',
  name: '会员积分翻倍月',
  description: '黄金、白银会员消费即可获得双倍积分奖励',
  type: 'points',
  startDate: '2024-02-01',
  endDate: '2024-02-29',
  status: 'active',
  rules: {
    targetAudience: ['gold', 'silver'],
    discount: 0,
    participantCount: 980,
    conversionRate: 42,
  },
});

db.campaign.create({
  id: '3',
  name: '生日特权月',
  description: '会员生日当月享受特别优惠及精美礼品',
  type: 'gift',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: 'active',
  rules: {
    targetAudience: ['gold', 'silver'],
    discount: 15,
    participantCount: 450,
    conversionRate: 68,
  },
});

db.campaign.create({
  id: '4',
  name: '五一促销活动',
  description: '五一假期全场特惠，多重好礼等你来',
  type: 'discount',
  startDate: '2024-05-01',
  endDate: '2024-05-07',
  status: 'scheduled',
  rules: {
    targetAudience: ['all'],
    discount: 15,
    participantCount: 0,
    conversionRate: 0,
  },
});

db.campaign.create({
  id: '5',
  name: '618购物节',
  description: '年中大促，折扣力度空前',
  type: 'discount',
  startDate: '2024-06-01',
  endDate: '2024-06-18',
  status: 'scheduled',
  rules: {
    targetAudience: ['all'],
    discount: 30,
    participantCount: 0,
    conversionRate: 0,
  },
});

db.campaign.create({
  id: '6',
  name: '会员专属积分兑换',
  description: '积分兑换心仪好礼，优惠多多',
  type: 'points',
  startDate: '2024-03-01',
  endDate: '2024-03-31',
  status: 'scheduled',
  rules: {
    targetAudience: ['gold', 'silver', 'bronze'],
    discount: 0,
    participantCount: 0,
    conversionRate: 0,
  },
});

db.campaign.create({
  id: '7',
  name: '开年送福利',
  description: '新年第一波折扣来袭',
  type: 'discount',
  startDate: '2024-01-01',
  endDate: '2024-01-10',
  status: 'ended',
  rules: {
    targetAudience: ['all'],
    discount: 25,
    participantCount: 2150,
    conversionRate: 48,
  },
});

db.campaign.create({
  id: '8',
  name: '元旦狂欢节',
  description: '元旦期间消费满额送好礼',
  type: 'gift',
  startDate: '2023-12-30',
  endDate: '2024-01-02',
  status: 'ended',
  rules: {
    targetAudience: ['all'],
    discount: 0,
    participantCount: 1680,
    conversionRate: 55,
  },
});

// 添加转化指标数据
const campaigns = ['新春特惠活动', '会员积分翻倍月', '生日特权月', '五一促销活动'];
const baseData = [
  { conversion: 0.35, participantCount: 1580, totalRevenue: 158000 },
  { conversion: 0.42, participantCount: 980, totalRevenue: 196000 },
  { conversion: 0.68, participantCount: 450, totalRevenue: 89000 },
  { conversion: 0, participantCount: 0, totalRevenue: 0 }
];

// 生成最近7天的转化指标数据
for (let i = 0; i < campaigns.length; i++) {
  for (let j = 0; j < 7; j++) {
    const date = new Date();
    date.setDate(date.getDate() - j);
    const dateStr = date.toISOString().split('T')[0];
    
    // 添加随机波动
    const randomFactor = 0.9 + Math.random() * 0.2; // 0.9-1.1之间的随机数
    
    db.conversionMetric.create({
      id: `${i + 1}-${j}`,
      campaignId: String(i + 1),
      campaignName: campaigns[i],
      conversion: baseData[i].conversion * randomFactor,
      participantCount: Math.round(baseData[i].participantCount * randomFactor),
      totalRevenue: Math.round(baseData[i].totalRevenue * randomFactor),
      date: dateStr,
    });
  }
}

// 添加更多的活动效果数据，确保每个活动都有足够的数据点
const generateMoreEffectData = (campaignId: string, baseUV: number, basePV: number, baseConversion: number) => {
  const days = 30;
  const result = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // 添加一些随机波动和趋势
    const trend = 1 + (i / days) * 0.2; // 添加上升趋势
    const randomFactor = (0.9 + Math.random() * 0.2) * trend; // 0.9-1.1之间的随机数，并考虑趋势
    
    result.push({
      id: `${campaignId}-${dateStr}`,
      campaignId,
      date: dateStr,
      uv: Math.round(baseUV * randomFactor),
      pv: Math.round(basePV * randomFactor),
      conversion: baseConversion * randomFactor,
    });
  }
  
  return result;
};

// 为每个活动生成更多的效果数据
[
  { id: '1', baseUV: 1000, basePV: 2000, baseConversion: 0.35 },
  { id: '2', baseUV: 800, basePV: 1500, baseConversion: 0.42 },
  { id: '3', baseUV: 500, basePV: 1000, baseConversion: 0.68 },
  { id: '4', baseUV: 0, basePV: 0, baseConversion: 0 }
].forEach(({ id, baseUV, basePV, baseConversion }) => {
  const data = generateMoreEffectData(id, baseUV, basePV, baseConversion);
  data.forEach(item => db.campaignEffect.create(item));
});

// 清除旧的会员分析数据
db.memberAnalytics.deleteMany({
  where: {
    id: {
      contains: '',
    },
  },
});

db.memberGrowth.deleteMany({
  where: {
    id: {
      contains: '',
    },
  },
});

// 添加会员分析数据
const generateMemberAnalytics = () => {
  const months = 12;
  const baseMembers = {
    total: 1000,
    new: 30,
    active: 700,
    inactive: 300,
  };

  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const dateStr = date.toISOString().split('T')[0];

    // 添加增长趋势
    const growthFactor = 1 + (0.05 * (months - i)); // 越近期增长越多
    
    db.memberAnalytics.create({
      id: `analytics-${i}`,
      date: dateStr,
      totalMembers: Math.round(baseMembers.total * growthFactor),
      newMembers: Math.round(baseMembers.new * (1 + Math.random() * 0.5)), // 随机波动
      activeMembers: Math.round(baseMembers.active * growthFactor),
      inactiveMembers: Math.round(baseMembers.inactive * (1 + i * 0.1)), // 缓慢增长
    });
  }
};

// 生成会员增长趋势数据
const generateMemberGrowth = () => {
  const days = 180; // 半年的数据
  const baseGrowth = 20;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // 添加周末峰值和工作日波动
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2之间的随机波动
    const weekendBonus = isWeekend ? 1.5 : 1; // 周末1.5倍
    // 添加月初促销效应
    const isMonthStart = date.getDate() <= 5;
    const monthStartBonus = isMonthStart ? 1.3 : 1; // 月初1.3倍
    // 添加季节性波动
    const month = date.getMonth();
    const seasonalFactor = 1 + Math.sin((month / 12) * Math.PI * 2) * 0.2; // ±20%的季节性波动

    const dailyGrowth = Math.round(
      baseGrowth * randomFactor * weekendBonus * monthStartBonus * seasonalFactor
    );

    db.memberGrowth.create({
      id: `growth-${i}`,
      date: dateStr,
      count: dailyGrowth,
    });
  }
};

// 生成数据
generateMemberAnalytics();
generateMemberGrowth();

