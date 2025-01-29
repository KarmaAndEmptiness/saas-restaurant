import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Tabs, Select, Space, DatePicker, message, Progress } from 'antd';
import { Line, Column } from '@ant-design/plots';
import { 
  getCampaigns,
  getCampaignEffects,
  getConversionMetrics,
  type Campaign 
} from '../../api/marketing';
import dayjs from 'dayjs';

interface CampaignEffect {
  campaign: string;
  uv: number;
  pv: number;
  conversion: number;
  date: string;
}

interface ConversionData {
  campaignId: string;
  campaignName: string;
  conversion: number;
  participantCount: number;
  totalRevenue: number;
}

const EffectAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>();
  const [effectData, setEffectData] = useState<CampaignEffect[]>([]);
  const [conversionData, setConversionData] = useState<ConversionData[]>([]);

  // 获取活动列表
  const fetchCampaigns = async () => {
    try {
      const response = await getCampaigns();
      const activeCampaigns = response.data.filter(
        (campaign: Campaign) => campaign.status === 'active' || campaign.status === 'ended'
      );
      setCampaigns(activeCampaigns);
      if (activeCampaigns.length > 0) {
        setSelectedCampaign(activeCampaigns[0].id);
      }
    } catch (error) {
      console.error('获取活动列表失败:', error);
      message.error('获取活动列表失败');
    }
  };

  // 获取活动效果数据
  const fetchEffectData = async (campaignId: string) => {
    setLoading(true);
    try {
      const [effectResponse, conversionResponse] = await Promise.all([
        getCampaignEffects(campaignId),
        getConversionMetrics({
          startDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
          campaignId
        })
      ]);

      setEffectData(effectResponse.data);
      setConversionData(conversionResponse.data);
    } catch (error) {
      console.error('获取活动效果数据失败:', error);
      message.error('获取活动效果数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      fetchEffectData(selectedCampaign);
    }
  }, [selectedCampaign]);

  // 折线图配置
  const lineConfig = {
    data: effectData,
    xField: 'date',
    yField: 'uv',
    seriesField: 'campaign',
    yAxis: {
      label: {
        formatter: (v: number) => `${v} 次`,
      },
    },
    legend: {
      position: 'top' as const,
    },
    smooth: true,
    tooltip: {
      formatter: (datum: CampaignEffect) => {
        return {
          name: datum.campaign,
          value: `访问量: ${datum.uv}\n转化率: ${(datum.conversion * 100).toFixed(1)}%`,
        };
      },
    },
  };

  // 柱状图配置
  const columnConfig = {
    data: conversionData,
    xField: 'campaignName',
    yField: 'conversion',
    label: {
      formatter: (v: { conversion: number }) => `${(v.conversion * 100).toFixed(1)}%`,
    },
    meta: {
      conversion: {
        formatter: (val: number) => `${(val * 100).toFixed(1)}%`,
      },
    },
  };

  return (
    <PageContainer title="营销效果分析">
      <Card 
        bordered={false}
        extra={
          <Space>
            <Select
              style={{ width: 200 }}
              placeholder="选择活动"
              value={selectedCampaign}
              onChange={setSelectedCampaign}
              options={campaigns.map(campaign => ({
                label: campaign.name,
                value: campaign.id,
              }))}
            />
            <DatePicker.RangePicker />
          </Space>
        }
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: '活动效果总览',
              children: (
                <Card bordered={false} loading={loading}>
                  <Line {...lineConfig} height={400} />
                </Card>
              ),
            },
            {
              key: '2',
              label: '转化率分析',
              children: (
                <Card bordered={false} loading={loading}>
                  <Column {...columnConfig} height={300} />
                  <div style={{ padding: 24 }}>
                    <h3>活动转化详情</h3>
                    {conversionData.map((item) => (
                      <div key={item.campaignId} style={{ marginBottom: 24 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginBottom: 8 
                        }}>
                          <span>{item.campaignName}</span>
                          <span>参与人数：{item.participantCount}</span>
                        </div>
                        <Progress
                          percent={Number((item.conversion * 100).toFixed(1))}
                          status="active"
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                        />
                        <div style={{ textAlign: 'right', color: '#888' }}>
                          总收入：¥{item.totalRevenue.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ),
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default EffectAnalysis;
