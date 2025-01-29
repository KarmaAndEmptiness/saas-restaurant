import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Form,
  DatePicker,
  Select,
  Input,
  message,
  Tag,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  UserOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { logs } from '@/api/admin';
import type { LogItem } from '@/api/admin';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TableCard = styled(Card)`
  .ant-card-body {
    padding: 0;
  }
  .ant-table-wrapper {
    .ant-table-pagination {
      margin: 16px;
    }
  }
`;

const TopBar = styled.div`
  padding: 16px;
  background: white;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
`;

const SystemLogs: React.FC = () => {
  const [logList, setLogList] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();

  // 获取日志列表
  const fetchLogs = async (params?: {
    startTime?: string;
    endTime?: string;
    type?: string;
    operator?: string;
  }) => {
    setLoading(true);
    try {
      const response = await logs.list(params);
      setLogList(response.data);
    } catch (error) {
      console.error('获取日志失败:', error);
      message.error('获取日志失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      const params: {
        startTime?: string;
        endTime?: string;
        type?: string;
        operator?: string;
      } = {};

      if (values.dateRange) {
        params.startTime = values.dateRange[0].format('YYYY-MM-DD HH:mm:ss');
        params.endTime = values.dateRange[1].format('YYYY-MM-DD HH:mm:ss');
      }
      if (values.type) {
        params.type = values.type;
      }
      if (values.operator) {
        params.operator = values.operator;
      }

      fetchLogs(params);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  const handleExport = async () => {
    try {
      const values = await searchForm.validateFields();
      const params: {
        startTime?: string;
        endTime?: string;
        type?: string;
        operator?: string;
      } = {};

      if (values.dateRange) {
        params.startTime = values.dateRange[0].format('YYYY-MM-DD HH:mm:ss');
        params.endTime = values.dateRange[1].format('YYYY-MM-DD HH:mm:ss');
      }
      if (values.type) {
        params.type = values.type;
      }
      if (values.operator) {
        params.operator = values.operator;
      }

      await logs.export(params);
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined />
          {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
        </Space>
      ),
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'operatorRole',
      key: 'operatorRole',
    },
    {
      title: '级别',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors: Record<string, string> = {
          info: 'blue',
          warning: 'gold',
          error: 'red',
          success: 'green',
        };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      render: (text: string) => (
        <Space>
          <InfoCircleOutlined />
          {text}
        </Space>
      ),
    },
  ];

  return (
    <>
      <TopBar>
        <SearchBar>
          <Form form={searchForm} layout="inline">
            <Form.Item name="dateRange" label="时间范围">
              <RangePicker
                showTime
                placeholder={['开始时间', '结束时间']}
              />
            </Form.Item>
            <Form.Item name="type" label="日志级别">
              <Select style={{ width: 120 }} placeholder="请选择级别">
                <Option value="info">信息</Option>
                <Option value="warning">警告</Option>
                <Option value="error">错误</Option>
                <Option value="success">成功</Option>
              </Select>
            </Form.Item>
            <Form.Item name="operator" label="操作人">
              <Input placeholder="请输入操作人" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
        </SearchBar>
        <Button
          icon={<ExportOutlined />}
          onClick={handleExport}
        >
          导出日志
        </Button>
      </TopBar>

      <TableCard>
        <Table
          columns={columns}
          dataSource={logList}
          loading={loading}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </TableCard>
    </>
  );
};

export default SystemLogs; 