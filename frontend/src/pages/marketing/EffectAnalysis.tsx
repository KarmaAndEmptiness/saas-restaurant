import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { 
  Card, 
  Tabs, 
  Select, 
  Space, 
  DatePicker, 
  message, 
  Progress, 
  Row, 
  Col, 
  Statistic, 
  Button,
  Tag,
  Tooltip,
  Radio
} from 'antd';
import { Line, Column, Pie } from '@ant-design/plots';
import { 
  getCampaigns,
  getCampaignEffects,
  getConversionMetrics,
  type Campaign 
} from '../../api/marketing';
import dayjs from 'dayjs';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  SwapOutlined,
  ReloadOutlined
} from '@ant-design/icons';

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
  const [startDate, setStartDate] = useState<string>(dayjs().subtract(30, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [effectData, setEffectData] = useState<CampaignEffect[]>([]);
  const [conversionData, setConversionData] = useState<ConversionData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareCampaign, setCompareCampaign] = useState<string>();

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
  const fetchEffectData = async (campaignId: string, startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const [effectResponse, conversionResponse] = await Promise.all([
        getCampaignEffects(campaignId, startDate, endDate),
        getConversionMetrics({
          startDate:startDate || dayjs('2024-01-01').format('YYYY-MM-DD'),
          endDate: endDate || dayjs().format('YYYY-MM-DD'),
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
      fetchEffectData(selectedCampaign, startDate, endDate);
    }
  }, [selectedCampaign, startDate, endDate]);

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

  // 新增：渲染KPI指标卡片
  const renderKPICards = () => {
    const currentCampaign = conversionData.find(d => d.campaignId === selectedCampaign);
    if (!currentCampaign) return null;

    return (
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic
              title="参与人数"
              value={currentCampaign.participantCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={
                <Tooltip title="较上期">
                  <Tag color="success" style={{ marginLeft: 8 }}>
                    <ArrowUpOutlined /> 12.3%
                  </Tag>
                </Tooltip>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic
              title="转化率"
              value={currentCampaign.conversion * 100}
              precision={2}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix={
                <>
                  %
                  <Tooltip title="较上期">
                    <Tag color="error" style={{ marginLeft: 8 }}>
                      <ArrowDownOutlined /> 4.2%
                    </Tag>
                  </Tooltip>
                </>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic
              title="总收入"
              value={currentCampaign.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={
                <Tooltip title="较上期">
                  <Tag color="success" style={{ marginLeft: 8 }}>
                    <ArrowUpOutlined /> 8.5%
                  </Tag>
                </Tooltip>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="kpi-card">
            <Statistic
              title="客单价"
              value={currentCampaign.totalRevenue / currentCampaign.participantCount}
              prefix={<ShoppingCartOutlined />}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix={
                <Tooltip title="较上期">
                  <Tag color="success" style={{ marginLeft: 8 }}>
                    <ArrowUpOutlined /> 2.1%
                  </Tag>
                </Tooltip>
              }
            />
          </Card>
        </Col>
      </Row>
    );
  };

  // 新增：渲染时间范围选择器
  const renderTimeRangeSelector = () => (
    <Space>
      <Radio.Group value={timeRange} onChange={e => {
        const value = e.target.value;
        setTimeRange(value);
        if (value !== 'custom') {
          const end = dayjs();
          const start = dayjs().subtract(
            value === '7d' ? 7 : value === '30d' ? 30 : 90,
            'days'
          );
          setStartDate(start.format('YYYY-MM-DD'));
          setEndDate(end.format('YYYY-MM-DD'));
        }
      }}>
        <Radio.Button value="7d">近7天</Radio.Button>
        <Radio.Button value="30d">近30天</Radio.Button>
        <Radio.Button value="90d">近90天</Radio.Button>
        <Radio.Button value="custom">自定义</Radio.Button>
      </Radio.Group>
      {timeRange === 'custom' && (
        <DatePicker.RangePicker
          value={[dayjs(startDate), dayjs(endDate)]}
          onChange={(_, dateStrings) => {
            if (dateStrings) {
              setStartDate(dateStrings[0]);
              setEndDate(dateStrings[1]);
            }
          }}
        />
      )}
    </Space>
  );

  return (
    <PageContainer 
      title="营销效果分析"
      extra={
        <Space>
          <Button 
            icon={<SwapOutlined />}
            onClick={() => setCompareMode(!compareMode)}
            type={compareMode ? 'primary' : 'default'}
          >
            对比分析
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
              if (selectedCampaign) {
                fetchEffectData(selectedCampaign, startDate, endDate);
              }
            }}
          >
            刷新数据
          </Button>
        </Space>
      }
    >
      <Card 
        bordered={false}
        className="filter-card"
        extra={renderTimeRangeSelector()}
      >
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
          {compareMode && (
            <Select
              style={{ width: 200 }}
              placeholder="选择对比活动"
              value={compareCampaign}
              onChange={setCompareCampaign}
              options={campaigns
                .filter(c => c.id !== selectedCampaign)
                .map(campaign => ({
                  label: campaign.name,
                  value: campaign.id,
                }))}
            />
          )}
        </Space>
      </Card>

      {renderKPICards()}

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: '活动效果趋势',
            children: (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card bordered={false} loading={loading} title="访问量趋势">
                    <Line {...{
                      ...lineConfig,
                      height: 350,
                      smooth: true,
                      animation: {
                        appear: {
                          animation: 'wave-in',
                          duration: 1000,
                        },
                      },
                      theme: {
                        geometries: {
                          line: {
                            lineWidth: 2,
                          },
                        },
                      },
                    }} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={false} loading={loading} title="转化率趋势">
                    <Line 
                      data={effectData}
                      xField="date"
                      yField="conversion"
                      seriesField="campaign"
                      height={300}
                      yAxis={{
                        label: {
                          formatter: (v: string) => `${(Number(v) * 100).toFixed(1)}%`,
                        },
                      }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={false} loading={loading} title="活动收入分布">
                    <Pie
                      data={conversionData.map(item => ({
                        type: item.campaignName,
                        value: item.totalRevenue,
                      }))}
                      angleField="value"
                      colorField="type"
                      radius={0.8}
                      height={300}
                      label={{
                        type: 'outer',
                        content: '{name}: {percentage}',
                      }}
                      interactions={[
                        {
                          type: 'element-active',
                        },
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: '2',
            label: '转化率分析',
            children: (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card bordered={false} loading={loading}>
                    <Column {...{
                      ...columnConfig,
                      height: 300,
                      label: {
                        position: 'middle',
                        style: {
                          fill: '#fff',
                        },
                      },
                      columnStyle: {
                        radius: [20, 20, 0, 0],
                      },
                    }} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card 
                    bordered={false} 
                    loading={loading}
                    title="活动转化详情"
                  >
                    {conversionData.map((item) => (
                      <div key={item.campaignId} style={{ marginBottom: 24 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginBottom: 8 
                        }}>
                          <Space>
                            <span style={{ fontSize: 16, fontWeight: 500 }}>{item.campaignName}</span>
                            <Tag color="blue">参与人数：{item.participantCount}</Tag>
                          </Space>
                          <span style={{ color: '#52c41a', fontSize: 16 }}>
                            总收入：¥{item.totalRevenue.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          percent={Number((item.conversion * 100).toFixed(1))}
                          status="active"
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                          strokeWidth={12}
                        />
                      </div>
                    ))}
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />

      <style>{`
        .kpi-card {
          box-shadow: 0 2px 8px rgba(0,0,0,0.09);
          border-radius: 8px;
          transition: all 0.3s;
        }
        .kpi-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }
        .filter-card {
          margin-bottom: 24px;
          border-radius: 8px;
        }
        .ant-card {
          border-radius: 8px;
        }
      `}</style>
    </PageContainer>
  );
};

export default EffectAnalysis;
