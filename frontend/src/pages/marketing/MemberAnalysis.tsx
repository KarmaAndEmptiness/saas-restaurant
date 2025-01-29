import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic, DatePicker, Space, message } from 'antd';
import { Column } from '@ant-design/plots';
import { getMemberAnalytics } from '../../api/marketing';
import dayjs, { Dayjs } from 'dayjs';

interface MemberStats {
  totalMembers: number;
  newMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  growthTrend: Array<{
    month: string;
    value: number;
  }>;
}

interface GrowthTrendItem {
  date: string;
  count: number;
}

const MemberAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [memberStats, setMemberStats] = useState<MemberStats>({
    totalMembers: 0,
    newMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    growthTrend: [],
  });

  // 获取会员统计数据
  const fetchMemberStats = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      const response = await getMemberAnalytics({
        startDate: startDate || dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
        endDate: endDate || dayjs().format('YYYY-MM-DD'),
      });

      setMemberStats({
        totalMembers: response.data.totalMembers,
        newMembers: response.data.newMembers,
        activeMembers: response.data.activeMembers,
        inactiveMembers: response.data.inactiveMembers,
        growthTrend: response.data.growthTrend.map((item: GrowthTrendItem) => ({
          month: dayjs(item.date).format('M月'),
          value: item.count,
        })),
      });
    } catch (error) {
      console.error('获取会员统计数据失败:', error);
      message.error('获取会员统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberStats();
  }, []);

  // 图表配置
  const config = {
    data: memberStats.growthTrend,
    xField: 'month',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      value: {
        alias: '会员数',
      },
    },
  };

  // 处理日期范围变化
  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (!dates || !dates[0] || !dates[1]) {
      return;
    }
    fetchMemberStats(dateStrings[0], dateStrings[1]);
  };

  return (
    <PageContainer title="会员数据分析">
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="总会员数"
              value={memberStats.totalMembers}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="本月新增"
              value={memberStats.newMembers}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="活跃会员"
              value={memberStats.activeMembers}
              precision={0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="沉睡会员"
              value={memberStats.inactiveMembers}
              precision={0}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card 
        title="会员增长趋势" 
        style={{ marginTop: 24 }}
        bordered={false}
        loading={loading}
        extra={
          <Space>
            <DatePicker.RangePicker
              onChange={handleDateRangeChange}
              defaultValue={[
                dayjs().subtract(6, 'month'),
                dayjs()
              ]}
            />
          </Space>
        }
      >
        <Column {...config} height={300} />
      </Card>
    </PageContainer>
  );
};

export default MemberAnalysis;
