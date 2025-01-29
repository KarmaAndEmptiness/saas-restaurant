import request from '../utils/request';

// 日期范围参数接口定义
interface DateRangeParams {
  startDate: string;     // 开始日期
  endDate: string;       // 结束日期
  storeId?: string;      // 门店ID（可选）
}

// 报表配置接口定义
export interface ReportConfig {
  id?: string;           // 配置ID（可选，创建时不需要）
  name: string;          // 报表名称
  type: 'revenue' | 'settlement' | 'custom';  // 报表类型：收入、结算或自定义
  metrics: string[];     // 统计指标列表
  filters: {
    dateRange?: boolean;
    store?: boolean;
    category?: boolean;
    paymentMethod?: boolean;
  };
  schedule?: {           // 定时任务配置（可选）
    frequency: 'daily' | 'weekly' | 'monthly';  // 频率：每日、每周或每月
    recipients: string[];  // 接收者邮箱列表
  };
}

// 结算记录接口定义
interface SettlementRecord {
  storeId: string;       // 门店ID
  period: {              // 结算周期
    start: string;       // 开始日期
    end: string;         // 结束日期
  };
  amount: number;        // 结算金额
  status: 'pending' | 'completed' | 'failed';  // 结算状态：待处理、已完成或失败
  details: Record<string, unknown>;  // 结算详情
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface FinancialStatsParams {
  startDate?: string;
  endDate?: string;
  storeId?: string;
  type?: 'stores';
}

export interface PaymentStatsParams {
  startDate: string;
  endDate: string;
  storeId?: string;
}

export interface DailyRecordsParams {
  startDate: string;
  endDate: string;
  storeId?: string;
}

export interface SalesTrend {
  date: string;
  amount: number;
  type: string;
}

export interface PaymentStats {
  method: string;
  amount: number;
  percentage: number;
}

export interface DailyRecord {
  date: string;
  totalSales: number;
  orderCount: number;
  averageOrder: number;
  profit: number;
  growth?: {
    sales?: number;
    orders?: number;
  };
}

export interface FinancialStatsResponse {
  salesTrend: SalesTrend[];
  stores?: Store[];
}

// 财务统计相关API
export const getRevenueStats = (params: DateRangeParams) => {
  return request('/finance/revenue-stats', {
    method: 'GET',
    params,
  });
};

export const getExpenseStats = (params: DateRangeParams) => {
  return request('/finance/expense-stats', {
    method: 'GET',
    params,
  });
};

export const getProfitStats = (params: DateRangeParams) => {
  return request('/finance/profit-stats', {
    method: 'GET',
    params,
  });
};

// 门店结算相关API
export const createSettlement = (data: SettlementRecord) => {
  return request('/finance/settlements', {
    method: 'POST',
    data,
  });
};

export const getSettlements = (params: DateRangeParams) => {
  return request('/finance/settlements', {
    method: 'GET',
    params,
  });
};

export const getSettlementDetails = (id: string) => {
  return request(`/finance/settlements/${id}`, {
    method: 'GET',
  });
};

export const updateSettlementStatus = (id: string, status: SettlementRecord['status']) => {
  return request(`/finance/settlements/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
};

// 自定义报表相关API
export const createReportConfig = (data: ReportConfig) => {
  return request('/finance/report-configs', {
    method: 'POST',
    data,
  });
};

export const getReportConfigs = () => {
  return request('/finance/report-configs', {
    method: 'GET',
  });
};

export const updateReportConfig = (id: string, data: Partial<ReportConfig>) => {
  return request(`/finance/report-configs/${id}`, {
    method: 'PUT',
    data,
  });
};

export const deleteReportConfig = (id: string) => {
  return request(`/finance/report-configs/${id}`, {
    method: 'DELETE',
  });
};

export const generateReport = (configId: string, params: DateRangeParams) => {
  return request(`/finance/reports/generate/${configId}`, {
    method: 'POST',
    data: params,
  });
};

export const getReportHistory = (configId: string) => {
  return request(`/finance/reports/history/${configId}`, {
    method: 'GET',
  });
};

// 获取财务统计数据
export const getFinancialStats = (params: FinancialStatsParams) => {
  return request<FinancialStatsResponse>({
    url: '/finance/stats',
    method: 'GET',
    params,
  });
};

// 获取支付方式统计
export const getPaymentStats = (params: PaymentStatsParams) => {
  return request<PaymentStats[]>({
    url: '/finance/payment-stats',
    method: 'GET',
    params,
  });
};

// 获取每日记录
export const getDailyRecords = (params: DailyRecordsParams) => {
  return request<DailyRecord[]>({
    url: '/finance/daily-records',
    method: 'GET',
    params,
  });
};

// 导出财务报表
export const exportFinancialReport = (params: DailyRecordsParams) => {
  return request({
    url: '/finance/export',
    method: 'GET',
    params,
    responseType: 'blob',
  });
}; 
