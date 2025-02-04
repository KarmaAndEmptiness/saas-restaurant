import { http, HttpResponse } from 'msw';
import { db } from './db';
import type { Role, StaffMember } from '@/api/admin';
import type { LoginParams } from '@/api/auth';
import dayjs from 'dayjs';

// 生成随机验证码
function generateCaptcha() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 存储验证码
const captchaStore = new Map<string, string>();

export const handlers = [
  // --- 角色管理 API ---
  // 获取角色列表
  http.get('/api/admin/roles', () => {
    const roles = db.role.getAll();
    return HttpResponse.json({ data: roles });
  }),

  // 创建角色
  http.post('/api/admin/roles', async ({ request }) => {
    const data = await request.json() as Omit<Role, 'id' | 'userCount'>;
    const role = db.role.create({
      id: Math.random().toString(36).substring(7),
      userCount: 0,
      ...data,
    });
    return HttpResponse.json({ id: role.id }, { status: 201 });
  }),

  // 更新角色
  http.put('/api/admin/roles/:id', async ({ params, request }) => {
    const data = await request.json() as Partial<Role>;
    const role = db.role.update({
      where: {
        id: {
          equals: params.id as string,
        },
      },
      data,
    });
    return HttpResponse.json(role);
  }),

  // 删除角色
  http.delete('/api/admin/roles/:id', ({ params }) => {
    db.role.delete({
      where: {
        id: {
          equals: params.id as string,
        },
      },
    });
    return new HttpResponse(null, { status: 204 });
  }),

  // 更新角色权限
  http.put('/api/admin/roles/:id/permissions', async ({ params, request }) => {
    const { permissions } = await request.json() as { permissions: string[] };
    const role = db.role.update({
      where: {
        id: {
          equals: params.id as string,
        },
      },
      data: { permissions },
    });
    return HttpResponse.json(role);
  }),

  // --- 权限管理 API ---
  // 获取权限列表
  http.get('/api/admin/permissions', () => {
    const permissions = db.permission.getAll();
    return HttpResponse.json({ data: permissions });
  }),

  // --- 系统日志 API ---
  // 获取日志列表
  http.get('/api/admin/logs', ({ request }) => {
    const url = new URL(request.url);
    const startTime = url.searchParams.get('startTime');
    const endTime = url.searchParams.get('endTime');
    const type = url.searchParams.get('type');
    const operator = url.searchParams.get('operator');

    let logs = db.log.getAll();

    // 根据查询参数筛选日志
    if (startTime) {
      logs = logs.filter(log => log.timestamp >= startTime);
    }
    if (endTime) {
      logs = logs.filter(log => log.timestamp <= endTime);
    }
    if (type) {
      logs = logs.filter(log => log.type === type);
    }
    if (operator) {
      logs = logs.filter(log => log.operator.includes(operator));
    }

    return HttpResponse.json({ data: logs });
  }),

  // 导出日志
  http.get('/api/admin/logs/export', () => {
    // 在实际项目中，这里应该返回一个 Excel 文件
    // 这里我们只返回一个空的 blob 来模拟
    const blob = new Blob([''], { type: 'application/vnd.ms-excel' });
    return new HttpResponse(blob, {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': 'attachment; filename=logs.xlsx',
      },
    });
  }),

  // --- 管理人员后台 ---
  // 获取员工列表
  http.get('/api/admin/staff', () => {
    const staffList = db.staff.getAll();
    return HttpResponse.json({ data: staffList });
  }),

  // 添加员工
  http.post('/api/admin/staff', async ({ request }) => {
    const newStaff = await request.json() as Omit<StaffMember, 'id'>;
    const staff = db.staff.create({
      id: Math.random().toString(36).substring(7),
      ...newStaff,
    });
    return HttpResponse.json({ id: staff.id }, { status: 201 });
  }),
  //更新员工
  http.put('/api/admin/staff/:id', async ({ params, request }) => {
    const data = await request.json() as Partial<StaffMember>;
    const staff = db.staff.update({
      where: { id: { equals: params.id as string } },
      data,
    });
    return HttpResponse.json(staff);
  }),
  //删除员工
  http.delete('/api/admin/staff/:id', ({ params }) => {
    db.staff.delete({
      where: { id: { equals: params.id as string } },
    });
    return new HttpResponse(null, { status: 204 });
  }),
  

  // --- 收银前台 ---
  // 会员开卡
  http.post('/api/cashier/member', async ({ request }) => {
    const memberData = await request.json() as { phone: string; balance: number; points: number };
    const newMember = db.member.create(memberData);
    return HttpResponse.json({ id: newMember.id });
  }),

  // --- 财务中心 ---
  // 获取日结报表
  http.get('/api/finance/daily-report', () => {
    const orders = db.order.getAll();
    return HttpResponse.json({ totalAmount: orders.reduce((sum, o) => sum + o.amount, 0) });
  }),

  // --- 财务中心 API ---
  // 获取财务统计数据
  http.get('/api/finance/stats', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // 门店列表
    if (type === 'stores') {
      const stores = db.store.getAll();
      return HttpResponse.json({
        data: {
          stores,
          salesTrend: [],
        }
      });
    }

    // 销售趋势
    let salesTrend = db.sale.getAll();
    
    // 根据日期筛选
    if (startDate && endDate) {
      salesTrend = salesTrend.filter(sale => 
        sale.date >= startDate && 
        sale.date <= endDate
      );
    }

    return HttpResponse.json({
      data: {
        salesTrend,
        stores: [],
      }
    });
  }),

  // 获取支付方式统计
  http.get('/api/finance/payment-stats', () => {
    const stats = db.payment.getAll();    
    return HttpResponse.json({ data: stats });
  }),

  // 获取每日记录
  http.get('/api/finance/daily-records', ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    let records = db.dailyRecord.getAll();
    
    // 根据日期筛选
    if (startDate && endDate) {
      records = records.filter(record => 
        record.date >= startDate && 
        record.date <= endDate
      );
    }

    // 确保数据格式正确
    const formattedRecords = records.map(record => ({
      date: record.date,
      totalSales: Number(record.totalSales),
      orderCount: Number(record.orderCount),
      averageOrder: Number(record.averageOrder),
      profit: Number(record.profit),
      growth: {
        sales: record.growth?.sales,
        orders: record.growth?.orders,
      },
    }));

    return HttpResponse.json({ data: formattedRecords });
  }),

  // 获取门店结算记录
  http.get('/api/finance/settlements', ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    let settlements = db.settlement.getAll();
    
    // 根据日期筛选
    if (startDate && endDate) {
      settlements = settlements.filter(s => 
        s.period.start >= startDate && 
        s.period.end <= endDate
      );
    }

    const formattedSettlements = settlements.map(s => ({
      id: s.id,
      storeId: s.storeId,
      storeName: s.storeName,
      period: `${s.period.start} 至 ${s.period.end}`,
      amount: Number(s.totalAmount),
      commission: Number(s.commission),
      actualAmount: Number(s.settledAmount),
      status: s.status,
      createTime: new Date(s.period.start).toISOString(),
      completeTime: s.status === 'completed' ? new Date().toISOString() : undefined,
      bankAccount: (s.items?.[0] as { bankAccount?: string })?.bankAccount || undefined,
      bankName: (s.items?.[0] as { bankName?: string })?.bankName || undefined,
      remark: (s.items?.[0] as { remark?: string })?.remark || undefined,
    }));

    return HttpResponse.json({ 
      data: formattedSettlements,
      total: formattedSettlements.length 
    });
  }),
  //  PUT /api/finance/settlements/status/1
  http.put('/api/finance/settlements/status/:id', ({ params }) => {
    const settlement = db.settlement.update({
      where: { id: { equals: params.id as string } },
      data: { status: 'completed' }
    });
    return HttpResponse.json(settlement);
  }),

  // POST /api/finance/settlements
  http.post('/api/finance/settlements', async ({ request }) => {
    const data = await request.json() as {
      storeId: string;
      period: {
        start: string;
        end: string;
      };
      amount: number;
      status: string;
      details: {
        bankAccount: string;
        bankName: string;
        remark: string;
      };
    };

    const settlement = db.settlement.create({
      id: String(Date.now()),
      storeId: data.storeId,
      storeName: "测试门店", // 在实际应用中应该从数据库查询
      period: data.period,
      totalAmount: data.amount,
      commission: data.amount * 0.03, // 3% 手续费
      settledAmount: data.amount * 0.97,
      status: data.status,
      items: [{
        bankAccount: data.details.bankAccount,
        bankName: data.details.bankName,
        remark: data.details.remark
      }]
    });

    return HttpResponse.json(settlement, { status: 201 });
  }),
  // --- 会员营销 ---
  // 获取营销活动列表
  http.get('/api/marketing/campaigns', () => {
    const campaigns = db.campaign.getAll().map(campaign => ({
      ...campaign,
      rules: {
        ...campaign.rules,
        // 确保转化率是数字而不是百分比
        conversionRate: Number(campaign.rules.conversionRate) / 100,
      }
    }));
    return HttpResponse.json({ data: campaigns });
  }),

  // 创建营销活动
  http.post('/api/marketing/campaigns', async ({ request }) => {
    const data = await request.json() as {
      name: string;
      description: string;
      type: string;
      startDate: string;
      endDate: string;
      status: string;
      rules: {
        targetAudience: string[];
        discount: number;
        participantCount: number;
        conversionRate: number;
      };
    };

    const campaign = db.campaign.create({
      id: String(Date.now()),
      ...data,
      rules: {
        ...data.rules,
        // 存储时将转化率转换为百分比
        conversionRate: data.rules.conversionRate * 100,
      }
    });

    return HttpResponse.json({ data: campaign }, { status: 201 });
  }),

  // 更新营销活动
  http.put('/api/marketing/campaigns/:id', async ({ params, request }) => {
    const data = await request.json() as {
      name: string;
      description: string;
      type: string;
      startDate: string;
      endDate: string;
      status: string;
      rules: {
        targetAudience: string[];
        discount: number;
        participantCount: number;
        conversionRate: number;
      };
    };

    const campaign = db.campaign.update({
      where: { id: { equals: String(params.id) } },
      data: {
        ...data,
        rules: {
          ...data.rules,
          // 存储时将转化率转换为百分比
          conversionRate: data.rules.conversionRate * 100,
        }
      },
    });

    return HttpResponse.json({ data: campaign });
  }),

  // 删除营销活动
  http.delete('/api/marketing/campaigns/:id', ({ params }) => {
    db.campaign.delete({
      where: { id: { equals: String(params.id) } },
    });

    return new HttpResponse(null, { status: 204 });
  }),

  // 获取活动效果数据
  http.get('/api/marketing/campaign-effects/:id', ({ params, request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    let effects = db.campaignEffect.findMany({
      where: { campaignId: { equals: String(params.id) }},
    });
    if (startDate && endDate) {
      effects = effects.filter(effect => effect.date >= startDate && effect.date <= endDate);
    }
    return HttpResponse.json({ data: effects });
  }),

  // 获取转化指标
  http.get('/api/marketing/conversion-metrics', ({ request }) => {
    const url = new URL(request.url);
    const campaignId = url.searchParams.get('campaignId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    let metrics = db.conversionMetric.getAll();
    
    if (campaignId) {
      metrics = metrics.filter(metric => metric.campaignId === campaignId);
    }
    if (startDate && endDate) {
      metrics = metrics.filter(metric => metric.date >= startDate && metric.date <= endDate);
    }

    return HttpResponse.json({ data: metrics });
  }),

  // 获取会员分析数据
  http.get('/api/marketing/member-analytics', ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // 获取最新的会员统计数据
    const analytics = db.memberAnalytics.findFirst({
      where: {
        date: {
          equals: dayjs().format('YYYY-MM-DD')
        }
      }
    }) || {
      totalMembers: 0,
      newMembers: 0,
      activeMembers: 0,
      inactiveMembers: 0,
    };

    // 获取会员增长趋势
    let growthTrend = db.memberGrowth.getAll();
    
    // 根据日期筛选
    if (startDate && endDate) {
      growthTrend = growthTrend.filter(item => 
        item.date >= startDate && 
        item.date <= endDate
      );
    }

    // 按日期排序
    growthTrend.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    interface MonthlyGrowth {
      month: string;
      count: number;
    }

    // 合并相同月份的数据
    const monthlyGrowth = growthTrend.reduce((acc: MonthlyGrowth[], curr) => {
      const month = dayjs(curr.date).format('YYYY-MM');
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.count += curr.count;
      } else {
        acc.push({
          month: month,
          count: curr.count,
        });
      }
      return acc;
    }, []);

    return HttpResponse.json({
      data: {
        totalMembers: analytics.totalMembers,
        newMembers: analytics.newMembers,
        activeMembers: analytics.activeMembers,
        inactiveMembers: analytics.inactiveMembers,
        growthTrend: monthlyGrowth.map(item => ({
          date: item.month,
          count: item.count,
        })),
      }
    });
  }),

  // --- 认证相关 API ---
  // 获取验证码
  http.get('/api/auth/captcha', () => {
    const captchaText = generateCaptcha();
    const sessionId = Math.random().toString(36).substring(7);
    captchaStore.set(sessionId, captchaText);

    return HttpResponse.json({
      sessionId,
      captchaUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%231677ff">${captchaText}</text></svg>`
    });
  }),

  // 登录接口
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password, captcha, sessionId } = await request.json() as LoginParams;
    
    // 验证验证码
    const storedCaptcha = captchaStore.get(sessionId);
    if (!storedCaptcha || storedCaptcha.toLowerCase() !== captcha.toLowerCase()) {
      return new HttpResponse(
        JSON.stringify({ message: '验证码错误' }), 
        { status: 401 }
      );
    }
    
    // 验证完成后删除验证码
    captchaStore.delete(sessionId);
    
    const user = db.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });
    
    if (!user || user.password !== password) {
      return new HttpResponse(
        JSON.stringify({ message: '用户名或密码错误' }), 
        { status: 401 }
      );
    }

    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  }),

  // 获取用户信息接口
  http.get('/api/auth/user', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const user = db.user.findFirst({
      where: {
        role: {
          equals: 'admin'
        }
      }
    });
    
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      permissions: ['admin', 'user'],
    });
  }),

  // 登出接口
  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 200, statusText: 'OK' });
  }),

  // 获取报表配置列表
  http.get('/api/finance/report-configs', () => {
    const configs = db.reportConfig.getAll();
    return HttpResponse.json({ data: configs });
  }),

  // 创建报表配置
  http.post('/api/finance/report-configs', async ({ request }) => {
    const data = await request.json() as {
      name: string;
      type: string;
      metrics: string[];
      filters: {
        dateRange?: boolean;
        store?: boolean;
        category?: boolean;
        paymentMethod?: boolean;
      };
      schedule?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        recipients: string[];
      };
    };
    
    const config = db.reportConfig.create({
      id: Math.random().toString(36).substring(7),
      name: data.name,
      type: data.type,
      metrics: data.metrics,
      filters: data.filters,
      schedule: data.schedule || null,
    });
    
    return HttpResponse.json({ id: config.id }, { status: 201 });
  }),

  // 生成报表数据
  http.post('/api/finance/reports/generate/:id', () => {
    // 模拟报表数据
    const reportData = [
      { id: '1', date: '2024-01-01', store: '总店', category: '餐饮', amount: 12500, count: 125, paymentMethod: '微信支付' },
      { id: '2', date: '2024-01-01', store: '分店1', category: '饮品', amount: 8500, count: 85, paymentMethod: '支付宝' },
      { id: '3', date: '2024-01-02', store: '总店', category: '餐饮', amount: 15000, count: 150, paymentMethod: '现金' },
      { id: '4', date: '2024-01-02', store: '分店2', category: '饮品', amount: 9500, count: 95, paymentMethod: '微信支付' },
    ];
    return HttpResponse.json({ data: reportData });
  }),

  // --- 收银中心 API ---
  // 搜索会员
  http.get('/api/cashier/members/search', ({ request }) => {
    const url = new URL(request.url);
    const phone = url.searchParams.get('phone') || '';
    console.log(phone);
    const members = db.member.getAll().filter(member => 
      member.phone.includes(phone)
    );
    
    return HttpResponse.json({ data: members });
  }),

  // 获取会员积分余额
  http.get('/api/cashier/points/balance/:memberId', ({ params }) => {
    const memberId = String(params.memberId);
    console.log(memberId);
    const member = db.member.findFirst({
      where: { id: { equals: memberId } }
    });
    
    if (!member) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const points = db.points.findFirst({
      where: { memberId: { equals: memberId } }
    });
    
    return HttpResponse.json({ data: { points: points?.balance || 0 } });
  }),

  // 获取积分历史记录
  http.get('/api/cashier/points/history/:memberId', ({ params }) => {
    const memberId = String(params.memberId);
    const records = db.pointsHistory.findMany({
      where: { memberId: { equals: memberId } }
    });
    
    return HttpResponse.json({ data: records });
  }),

  // 积分操作（增加/扣减）
  http.post('/api/cashier/points/operate', async ({ request }) => {
    const { memberId, points, type, description } = await request.json() as {
      memberId: string;
      points: number;
      type: 'earn' | 'redeem';
      description: string;
    };
    
    const pointsRecord = db.pointsHistory.create({
      id: String(Date.now()),
      memberId,
      type,
      points: type === 'redeem' ? -points : points,
      description,
      createTime: new Date().toISOString(),
      operator: 'admin',
      balance: 0, // 临时值，下面会更新
    });
    
    // 更新积分余额
    const currentPoints = db.points.findFirst({
      where: { memberId: { equals: memberId } }
    });
    
    const newBalance = (currentPoints?.balance || 0) + (type === 'redeem' ? -points : points);
    
    if (currentPoints) {
      db.points.update({
        where: { id: { equals: currentPoints.id } },
        data: { balance: newBalance }
      });
    } else {
      db.points.create({
        id: String(Date.now()),
        memberId,
        balance: newBalance
      });
    }
    
    // 更新历史记录中的余额
    db.pointsHistory.update({
      where: { id: { equals: pointsRecord.id } },
      data: { balance: newBalance }
    });
    
    return HttpResponse.json({ success: true });
  }),

  // 创建交易记录
  http.post('/api/cashier/transactions', async ({ request }) => {
    const data = await request.json() as {
      memberId: string;
      amount: number;
      type: string;
      paymentMethod: string;
      items: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
      }>;
      usePoints?: number;
    };

    const transaction = db.transaction.create({
      id: String(Date.now()),
      ...data,
      createTime: new Date().toISOString(),
      status: 'completed'
    });
    
    return HttpResponse.json({ data: transaction });
  }),

  // 注册会员
  http.post('/api/cashier/members', async ({ request }) => {
    const data = await request.json() as {
      name: string;
      phone: string;
      email?: string;
      gender?: string;
      birthday?: string;
    };

    const member = db.member.create({
      id: String(Date.now()),
      ...data,
      createTime: new Date().toISOString(),
      status: 'active'
    });
    
    // 创建积分账户
    db.points.create({
      id: String(Date.now()),
      memberId: member.id,
      balance: 0
    });
    
    return HttpResponse.json({ data: member });
  }),

  // 会员头像上传
  http.post('/cashier/member', async ({ request }) => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      // 模拟文件上传成功
      return HttpResponse.json({
        url: URL.createObjectURL(file),
        status: 'success',
        message: '头像上传成功'
      });
    } catch (error) {
      console.log(error);
      return new HttpResponse(
        JSON.stringify({ 
          status: 'error',
          message: '头像上传失败'
        }), 
        { status: 500 }
      );
    }
  }),
];
