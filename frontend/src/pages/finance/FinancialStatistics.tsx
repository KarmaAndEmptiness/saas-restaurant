import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  Table,
  Statistic,
  Space,
  Divider,
  message,
} from 'antd';
import {
  Line,
  Pie,
} from '@ant-design/plots';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { 
  getFinancialStats, 
  getPaymentStats, 
  getDailyRecords,
  exportFinancialReport,
  type Store 
} from '../../api/finance';

const { RangePicker } = DatePicker;

interface SalesData {
  date: string;
  amount: number;
  type: string;
}

interface PaymentData {
  method: string;
  amount: number;
  percentage: number;
}

interface DailyRecord {
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

interface PieChartDatum {
  method?: string;
  amount?: number;
  percentage?: number;
}

const FinancialStatistics: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    fetchData();
  }, [dateRange, selectedStore]);

  // 获取门店列表
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await getFinancialStats({ type: 'stores' });
        if (response.data?.stores) {
          setStores(response.data.stores);
        }
      } catch (error) {
        console.error('获取门店列表失败:', error);
        message.error('获取门店列表失败');
      }
    };
    fetchStores();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = dateRange;
      const params = {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        storeId: selectedStore === 'all' ? undefined : selectedStore,
      };

      const [salesResponse, paymentResponse, recordsResponse] = await Promise.all([
        getFinancialStats(params),
        getPaymentStats(params),
        getDailyRecords(params),
      ]);

      if (salesResponse.data && salesResponse.data.salesTrend) {
        setSalesData(salesResponse.data.salesTrend);
      }
      
      // 确保支付数据格式正确
      if (paymentResponse.data) {
        const formattedPaymentData = paymentResponse.data.map((item: PaymentData) => ({
          method: String(item.method || '未知'),
          amount: Number(item.amount || 0),
          percentage: Number(item.percentage || 0),
        }));
        console.log('Payment data:', formattedPaymentData); // 添加日志
        setPaymentData(formattedPaymentData);
      }
      
      if (recordsResponse.data) {
        setDailyRecords(recordsResponse.data);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const [startDate, endDate] = dateRange;
      const params = {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        storeId: selectedStore === 'all' ? undefined : selectedStore,
      };
      
      await exportFinancialReport(params);
      message.success('报表导出成功');
    } catch (error) {
      console.error('导出报表失败:', error);
      message.error('导出报表失败，请重试');
    }
  };

  const columns: TableProps<DailyRecord>['columns'] = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '总销售额',
      dataIndex: 'totalSales',
      key: 'totalSales',
      render: (value) => `¥${value.toFixed(2)}`,
      sorter: (a, b) => a.totalSales - b.totalSales,
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      sorter: (a, b) => a.orderCount - b.orderCount,
    },
    {
      title: '平均客单价',
      dataIndex: 'averageOrder',
      key: 'averageOrder',
      render: (value) => `¥${value.toFixed(2)}`,
      sorter: (a, b) => a.averageOrder - b.averageOrder,
    },
    {
      title: '利润',
      dataIndex: 'profit',
      key: 'profit',
      render: (value) => `¥${value.toFixed(2)}`,
      sorter: (a, b) => a.profit - b.profit,
    },
    {
      title: '环比增长',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth) => (
        <Space direction="vertical" size="small">
          <span>
            销售额：
            {growth?.sales ? (
              <span style={{ color: growth.sales >= 0 ? '#52c41a' : '#f5222d' }}>
                {growth.sales >= 0 ? '+' : ''}{growth.sales}%
                {growth.sales >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              </span>
            ) : '-'}
          </span>
          <span>
            订单数：
            {growth?.orders ? (
              <span style={{ color: growth.orders >= 0 ? '#52c41a' : '#f5222d' }}>
                {growth.orders >= 0 ? '+' : ''}{growth.orders}%
                {growth.orders >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              </span>
            ) : '-'}
          </span>
        </Space>
      ),
    },
  ];

  // 计算总计
  const totalSales = dailyRecords.reduce((sum, record) => sum + record.totalSales, 0);
  const totalOrders = dailyRecords.reduce((sum, record) => sum + record.orderCount, 0);
  const averageOrderAmount = totalSales / totalOrders;
  const totalProfit = dailyRecords.reduce((sum, record) => sum + record.profit, 0);

  // 折线图配置
  const lineConfig = {
    data: salesData,
    xField: 'date',
    yField: 'amount',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    yAxis: {
      title: {
        text: '金额 (元)',
      },
      label: {
        formatter: (v: string) => `¥${Number(v).toLocaleString()}`,
      },
    },
    legend: {
      position: 'top',
    },
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fillOpacity: 1,
      },
    },
  };

  // 支付方式占比图配置
  const paymentConfig = {
    data: paymentData,
    angleField: 'amount',
    colorField: 'method',
    radius: 0.8,
    label: {
      autoRotate: false,
      formatter: (datum: PaymentData) => {
        if (!datum?.method) return '';
        const percentage = datum.percentage || 0;
        return `${datum.method}\n${percentage.toFixed(1)}%`;
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        if (!datum?.method) return { name: '', value: '' };
        const amount = datum.amount || 0;
        return {
          name: datum.method,
          value: `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        };
      },
    },
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
    interactions: [
      { type: 'element-active' },
      { type: 'pie-legend-active' },
    ],
    statistic: {
      title: false,
      content: false,
    },
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} size="middle">
        <RangePicker
          value={dateRange}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([dates[0], dates[1]]);
            }
          }}
        />
        <Select
          value={selectedStore}
          onChange={setSelectedStore}
          style={{ width: 120 }}
          loading={!stores.length}
        >
          <Select.Option value="all">全部门店</Select.Option>
          {stores.map(store => (
            <Select.Option key={store.id} value={store.id}>
              {store.name}
            </Select.Option>
          ))}
        </Select>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>
          刷新
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          导出报表
        </Button>
      </Space>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="总销售额"
              value={totalSales}
              precision={2}
              prefix="¥"
              suffix={
                dailyRecords[0]?.growth?.sales !== undefined && (
                  <span style={{ 
                    fontSize: '14px', 
                    color: dailyRecords[0].growth.sales >= 0 ? '#52c41a' : '#f5222d' 
                  }}>
                    {dailyRecords[0].growth.sales >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}{Math.abs(dailyRecords[0].growth.sales)}%
                  </span>
                )
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="总订单数"
              value={totalOrders}
              suffix={
                dailyRecords[0]?.growth?.orders !== undefined && (
                  <span style={{ 
                    fontSize: '14px', 
                    color: dailyRecords[0].growth.orders >= 0 ? '#52c41a' : '#f5222d' 
                  }}>
                    {dailyRecords[0].growth.orders >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}{Math.abs(dailyRecords[0].growth.orders)}%
                  </span>
                )
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="平均客单价"
              value={averageOrderAmount}
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="总利润"
              value={totalProfit}
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card
            title="销售趋势"
            loading={loading}
            bordered={false}
          >
            <Line {...lineConfig} height={300} />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="支付方式占比"
            loading={loading}
            bordered={false}
          >
            <Pie {...paymentConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Card
        title="每日销售明细"
        style={{ marginTop: 16 }}
        bordered={false}
      >
        <Table
          columns={columns}
          dataSource={dailyRecords}
          rowKey="date"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default FinancialStatistics; 
