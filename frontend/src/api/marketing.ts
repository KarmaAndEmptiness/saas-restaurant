import request from '../utils/request';

// 营销活动接口定义
export interface Campaign {
  id: string;            // 活动ID
  name: string;          // 活动名称
  description: string;   // 活动描述
  startDate: string;     // 开始日期
  endDate: string;       // 结束日期
  type: 'discount' | 'points' | 'gift';  // 活动类型：折扣、积分或赠品
  status: 'active' | 'scheduled' | 'ended';  // 活动状态：进行中、未开始或已结束
  rules: {              // 活动规则
    targetAudience?: string[];  // 目标会员等级
    discount?: number;          // 折扣力度
    participantCount?: number;  // 参与人数
    conversionRate?: number;    // 转化率
  };
}

// 会员分析参数接口
interface MemberAnalyticsParams {
  startDate: string;      // 开始日期
  endDate: string;        // 结束日期
  segmentId?: string;     // 会员分群ID（可选）
}

// 转化指标参数接口
interface ConversionMetrics {
  startDate: string;      // 开始日期
  endDate: string;        // 结束日期
  campaignId?: string;    // 活动ID（可选）
}

// 营销活动管理相关API
export const getCampaigns = () => {
  return request('/marketing/campaigns', {
    method: 'GET',
  });
};

export const createCampaign = (data: Omit<Campaign, 'id'>) => {
  return request('/marketing/campaigns', {
    method: 'POST',
    data,
  });
};

export const updateCampaign = (id: string, data: Partial<Campaign>) => {
  return request(`/marketing/campaigns/${id}`, {
    method: 'PUT',
    data,
  });
};

export const deleteCampaign = (id: string) => {
  return request(`/marketing/campaigns/${id}`, {
    method: 'DELETE',
  });
};

// 会员分析相关API
export const getMemberAnalytics = (params: MemberAnalyticsParams) => {
  return request('/marketing/member-analytics', {
    method: 'GET',
    params,
  });
};

export const getMemberSegments = () => {
  return request('/marketing/member-segments', {
    method: 'GET',
  });
};

export const getMemberBehavior = (params: MemberAnalyticsParams) => {
  return request('/marketing/member-behavior', {
    method: 'GET',
    params,
  });
};

// 效果分析相关API
export const getCampaignEffects = (campaignId: string) => {
  return request(`/marketing/campaign-effects/${campaignId}`, {
    method: 'GET',
  });
};

export const getMarketingROI = (params: MemberAnalyticsParams) => {
  return request('/marketing/roi', {
    method: 'GET',
    params,
  });
};

export const getConversionMetrics = (params: ConversionMetrics) => {
  return request('/marketing/conversion-metrics', {
    method: 'GET',
    params,
  });
}; 
