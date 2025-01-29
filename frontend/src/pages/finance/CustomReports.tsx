import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  Button,
  Space,
  Table,
  DatePicker,
  message,
  Row,
  Col,
  Checkbox,
  Divider,
  Tag,
  Modal,
  Input,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  QuestionCircleOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { 
  getReportConfigs, 
  createReportConfig, 
  generateReport, 
  getReportHistory,
  exportFinancialReport,
  type ReportConfig 
} from '../../api/finance';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface ReportData {
  id: string;
  date: string;
  store: string;
  category: string;
  amount: number;
  count: number;
  paymentMethod: string;
}

interface GenerateReportForm {
  template: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  store?: string;
  category?: string;
  paymentMethod?: string;
}

interface SaveTemplateForm {
  name: string;
  type: 'revenue' | 'settlement' | 'custom';
  fields: string[];
  filters: string[];
  description?: string;
}

interface ExportForm {
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  store?: string;
}

const CustomReports: React.FC = () => {
  const [templates, setTemplates] = useState<ReportConfig[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportConfig | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm<SaveTemplateForm>();
  const [exportForm] = Form.useForm<ExportForm>();

  // 获取报表模板列表
  useEffect(() => {
    fetchReportConfigs();
  }, []);

  const fetchReportConfigs = async () => {
    setLoading(true);
    try {
      const response = await getReportConfigs();
      setTemplates(response.data);
    } catch (error) {
      console.error('获取报表模板失败:', error);
      message.error('获取报表模板失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (values: GenerateReportForm) => {
    if (!selectedTemplate) return;

    setLoading(true);
    try {
      const response = await generateReport(selectedTemplate.id!, {
        startDate: values.dateRange?.[0].format('YYYY-MM-DD') || '',
        endDate: values.dateRange?.[1].format('YYYY-MM-DD') || '',
        storeId: values.store === 'all' ? undefined : values.store,
      });
      setReportData(response.data);
      message.success('报表生成成功');
    } catch (error) {
      console.error('生成报表失败:', error);
      message.error('生成报表失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (values: SaveTemplateForm) => {
    try {
      const templateData: ReportConfig = {
        name: values.name,
        type: values.type,
        metrics: values.fields,
        filters: {
          dateRange: values.filters.includes('dateRange'),
          store: values.filters.includes('store'),
          category: values.filters.includes('category'),
          paymentMethod: values.filters.includes('paymentMethod'),
        },
      };

      await createReportConfig(templateData);
      message.success('模板保存成功！');
      setModalVisible(false);
      fetchReportConfigs(); // 刷新模板列表
    } catch (error) {
      console.error('保存模板失败:', error);
      message.error('保存失败，请重试！');
    }
  };

  const handleExport = async () => {
    if (!selectedTemplate) return;
    
    try {
      const formValues = exportForm.getFieldsValue();
      const [startDate, endDate] = formValues.dateRange || [
        dayjs().subtract(30, 'days'),
        dayjs(),
      ];
      
      await exportFinancialReport({
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        storeId: formValues.store,
      });
      
      message.success('报表导出成功');
    } catch (error) {
      console.error('导出报表失败:', error);
      message.error('导出失败，请重试！');
    }
  };

  const columns: TableProps<ReportData>['columns'] = selectedTemplate?.metrics?.map((field: string) => {
    const columnConfig = {
      date: {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
      },
      store: {
        title: '门店',
        dataIndex: 'store',
        key: 'store',
      },
      category: {
        title: '类别',
        dataIndex: 'category',
        key: 'category',
      },
      amount: {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (value: number) => `¥${value.toFixed(2)}`,
      },
      count: {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
      },
      paymentMethod: {
        title: '支付方式',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        render: (value: string) => {
          const colorMap: Record<string, string> = {
            '微信支付': 'green',
            '支付宝': 'blue',
            '现金': 'orange',
          };
          return <Tag color={colorMap[value]}>{value}</Tag>;
        },
      },
    } as const;
    return columnConfig[field as keyof typeof columnConfig];
  }) || [];

  return (
    <div>
      <Card>
        <Form layout="inline" onFinish={handleGenerateReport}>
          <Form.Item
            name="template"
            label="报表模板"
            rules={[{ required: true, message: '请选择报表模板' }]}
          >
            <Select
              style={{ width: 200 }}
              placeholder="请选择报表模板"
              onChange={(value) => {
                const template = templates?.find(t => t.id === value);
                setSelectedTemplate(template || null);
              }}
            >
              {templates?.map(template => (
                <Option key={template.id} value={template.id}>
                  {template.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedTemplate?.filters.dateRange && (
            <Form.Item
              name="dateRange"
              label="日期范围"
              rules={[{ required: true, message: '请选择日期范围' }]}
            >
              <RangePicker />
            </Form.Item>
          )}

          {selectedTemplate?.filters.store && (
            <Form.Item
              name="store"
              label="门店"
            >
              <Select style={{ width: 150 }} placeholder="请选择门店">
                <Option value="all">全部门店</Option>
                <Option value="1">北京朝阳店</Option>
                <Option value="2">上海浦东店</Option>
              </Select>
            </Form.Item>
          )}

          {selectedTemplate?.filters.category && (
            <Form.Item
              name="category"
              label="类别"
            >
              <Select style={{ width: 150 }} placeholder="请选择类别">
                <Option value="all">全部类别</Option>
                <Option value="food">餐饮</Option>
                <Option value="drink">饮品</Option>
              </Select>
            </Form.Item>
          )}

          {selectedTemplate?.filters.paymentMethod && (
            <Form.Item
              name="paymentMethod"
              label="支付方式"
            >
              <Select style={{ width: 150 }} placeholder="请选择支付方式">
                <Option value="all">全部方式</Option>
                <Option value="wechat">微信支付</Option>
                <Option value="alipay">支付宝</Option>
                <Option value="cash">现金</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                生成报表
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                新建模板
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {reportData.length > 0 && (
          <>
            <Divider />
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  icon={<FileExcelOutlined />}
                  onClick={handleExport}
                >
                  导出Excel
                </Button>
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={handleExport}
                >
                  导出PDF
                </Button>
              </Space>
            </div>
            <Table
              columns={columns}
              dataSource={reportData}
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </>
        )}
      </Card>

      <Modal
        title="新建报表模板"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveTemplate}
          initialValues={{
            type: 'sales',
            fields: ['date', 'store', 'amount'],
            filters: ['dateRange', 'store'],
          }}
        >
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="报表类型"
            rules={[{ required: true, message: '请选择报表类型' }]}
          >
            <Select>
              <Option value="sales">销售报表</Option>
              <Option value="payment">支付报表</Option>
              <Option value="member">会员报表</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="fields"
            label={
              <Space>
                显示字段
                <Tooltip title="选择需要在报表中显示的字段">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: '请选择显示字段' }]}
          >
            <Checkbox.Group>
              <Row>
                <Col span={8}>
                  <Checkbox value="date">日期</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="store">门店</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="category">类别</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="amount">金额</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="count">数量</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="paymentMethod">支付方式</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="filters"
            label={
              <Space>
                筛选条件
                <Tooltip title="选择报表的筛选条件">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: '请选择筛选条件' }]}
          >
            <Checkbox.Group>
              <Row>
                <Col span={8}>
                  <Checkbox value="dateRange">日期范围</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="store">门店</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="category">类别</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="paymentMethod">支付方式</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入模板描述" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存模板
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomReports;

