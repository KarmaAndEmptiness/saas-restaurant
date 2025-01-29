import { http, HttpResponse } from 'msw';
import { db } from './db';

// 生成随机验证码
function generateCaptcha() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 存储验证码
const captchaStore = new Map<string, string>();

export const handlers = [
  // --- 管理人员后台 ---
  // 获取员工列表
  http.get('/api/admin/staff', () => {
    const staffList = db.staff.getAll();
    return new Response(JSON.stringify({ data: staffList }));
  }),

  // 添加员工
  http.post('/api/admin/staff', async ({request}) => {
    const newStaff = await request.json();
    const staff = db.staff.create(newStaff);
    return new Response(JSON.stringify({ id: staff.id }), { status: 201 });
  }),

  // --- 收银前台 ---
  // 会员开卡
  http.post('/api/cashier/member', async ({request}) => {
    const memberData = await request.json();
    const newMember = db.member.create(memberData);
    return new Response(JSON.stringify({ id: newMember.id }));
  }),

  // --- 财务中心 ---
  // 获取日结报表
  http.get('/api/finance/daily-report', ({}) => {
    const orders = db.order.getAll();
    return new Response(JSON.stringify({ totalAmount: orders.reduce((sum, o) => sum + o.amount, 0) }));
  }),

  // --- 会员营销 ---
  // 创建营销活动
  http.post('/api/marketing/campaigns', async ({request}) => {
    const campaign = await request.json();
    db.campaign.create(campaign);
    return new Response(null, { status: 201 });
  }),

  // 获取验证码
  http.get('/api/auth/captcha', () => {
    const captchaText = generateCaptcha();
    const sessionId = Math.random().toString(36).substring(7);
    captchaStore.set(sessionId, captchaText);

    // 这里返回一个假的验证码图片URL
    // 在实际项目中，应该返回真实的验证码图片
    return HttpResponse.json({
      sessionId,
      captchaUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%231677ff">${captchaText}</text></svg>`
    });
  }),

  // 登录接口
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password, captcha, sessionId } = await request.json();
    
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

    const user = db.user.findFirst();
    
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
    return new HttpResponse(null, { status: 200 });
  }),
];
