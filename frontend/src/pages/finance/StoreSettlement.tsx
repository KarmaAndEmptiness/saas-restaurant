import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  DatePicker,
  Select,
  Tag,
  message,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Statistic,
  Descriptions,
  Alert,
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  BankOutlined,
  ShopOutlined,
  DollarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { 
  getSettlements, 
  createSettlement, 
  updateSettlementStatus, 
  getSettlementDetails,
} from '../../api/finance';

const { RangePicker } = DatePicker;

interface Settlement {
  id: string;
  storeId: string;
  storeName: string;
  period: {
    start: string;
    end: string;
  };
  amount: number;
  commission: number;
  actualAmount: number;
  status: 'pending' | 'completed' | 'failed';
  createTime: string;
  completeTime?: string;
  bankAccount?: string;
  bankName?: string;
  remark?: string;
}

interface SettlementForm {
  bankAccount: string;
  bankName: string;
  remark?: string;
}

const StoreSettlement: React.FC = () => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);
  const [form] = Form.useForm<SettlementForm>();

  // 获取结算列表
  useEffect(() => {
    fetchSettlements();
  }, [dateRange]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = dateRange;
      const response = await getSettlements({
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });
      setSettlements(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('获取结算列表失败:', error);
      message.error('获取结算列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSettlement = async (values: SettlementForm) => {
    if (!selectedSettlement) return;

    setLoading(true);
    try {
      // 更新结算信息
      await updateSettlementStatus(selectedSettlement.id, 'completed');
      // 创建结算记录
      await createSettlement({
        storeId: selectedSettlement.storeId,
        period: selectedSettlement.period,
        amount: selectedSettlement.amount,
        status: 'completed',
        details: {
          bankAccount: values.bankAccount,
          bankName: values.bankName,
          remark: values.remark,
        },
      });
      message.success('结算成功！');
      setModalVisible(false);
      fetchSettlements(); // 刷新列表
    } catch (error) {
      console.error('结算失败:', error);
      message.error('结算失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = (record: Settlement) => {
    Modal.confirm({
      title: '确认拒绝结算？',
      content: '拒绝后需要重新发起结算申请',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await updateSettlementStatus(record.id, 'failed');
          message.success('已拒绝结算申请');
          fetchSettlements(); // 刷新列表
        } catch (error) {
          console.error('拒绝结算失败:', error);
          message.error('操作失败，请重试！');
        }
      },
    });
  };

  const handleViewDetails = async (record: Settlement) => {
    try {
      await getSettlementDetails(record.id);
      Modal.info({
        title: '结算详情',
        width: 600,
        content: (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="门店名称" span={2}>
              {record.storeName}
            </Descriptions.Item>
            <Descriptions.Item label="结算周期" span={2}>
              {record.period.start} 至 {record.period.end}
            </Descriptions.Item>
            <Descriptions.Item label="总金额">
              ¥{record.amount.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="手续费">
              ¥{record.commission.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="实付金额" span={2}>
              <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                ¥{record.actualAmount.toFixed(2)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="收款银行" span={2}>
              {record.bankName || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="收款账号" span={2}>
              {record.bankAccount || '-'}
            </Descriptions.Item>
            {record.remark && (
              <Descriptions.Item label="备注" span={2}>
                {record.remark}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="结算状态" span={2}>
              {getStatusTag(record.status)}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {record.createTime}
            </Descriptions.Item>
            {record.completeTime && (
              <Descriptions.Item label="完成时间" span={2}>
                {record.completeTime}
              </Descriptions.Item>
            )}
          </Descriptions>
        ),
      });
    } catch (error) {
      console.error('获取结算详情失败:', error);
      message.error('获取结算详情失败');
    }
  };

  const handleExport = () => {
    message.success('正在导出结算报表...');
  };

  const getStatusTag = (status: Settlement['status']) => {
    const statusMap = {
      pending: { color: 'processing', text: '待结算', icon: <ClockCircleOutlined /> },
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
      failed: { color: 'error', text: '已拒绝', icon: <CloseCircleOutlined /> },
    };
    const { color, text, icon } = statusMap[status];
    return <Tag color={color} icon={icon}>{text}</Tag>;
  };

  const columns: TableProps<Settlement>['columns'] = [
    {
      title: '门店信息',
      key: 'store',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>
            <ShopOutlined /> {record.storeName}
          </span>
          <span style={{ color: '#666', fontSize: '12px' }}>
            ID: {record.storeId}
          </span>
        </Space>
      ),
    },
    {
      title: '结算周期',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: '结算金额',
      key: 'amount',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>总金额：¥{record.amount.toFixed(2)}</span>
          <span style={{ color: '#666', fontSize: '12px' }}>
            手续费：¥{record.commission.toFixed(2)}
          </span>
          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
            实付：¥{record.actualAmount.toFixed(2)}
          </span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '完成时间',
      dataIndex: 'completeTime',
      key: 'completeTime',
      render: (time) => time || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setSelectedSettlement(record);
                  form.setFieldsValue({
                    bankAccount: record.bankAccount,
                    bankName: record.bankName,
                    remark: record.remark,
                  });
                  setModalVisible(true);
                }}
              >
                确认结算
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleReject(record)}
              >
                拒绝
              </Button>
            </>
          )}
          <Button
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 计算统计数据
  const totalSettlement = settlements?.reduce((sum, item) => sum + item.amount, 0);
  const totalCommission = settlements?.reduce((sum, item) => sum + item.commission, 0);
  const pendingCount = settlements?.filter(item => item.status === 'pending').length;

  return (
    <div>
      <Alert
        message="结算说明"
        description="1. 每月1号自动生成上月结算单；2. 结算金额包含商品销售额和会员充值金额；3. 结算手续费按照3%收取；4. 结算完成后资金将在1-3个工作日内到账。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title={<Space><DollarOutlined /> 待结算总额</Space>}
              value={totalSettlement}
              precision={2}
              prefix="¥"
            />
            <div style={{ color: '#666', fontSize: '14px', marginTop: 8 }}>
              待处理结算单：{pendingCount}个
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={<Space><BankOutlined /> 手续费总额</Space>}
              value={totalCommission}
              precision={2}
              prefix="¥"
            />
            <div style={{ color: '#666', fontSize: '14px', marginTop: 8 }}>
              手续费率：3%
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={<Space><CheckCircleOutlined /> 实际结算总额</Space>}
              value={totalSettlement - totalCommission}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="结算管理"
        extra={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]]);
                }
              }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部门店</Select.Option>
              <Select.Option value="S001">北京朝阳店</Select.Option>
              <Select.Option value="S002">上海浦东店</Select.Option>
            </Select>
            <Button icon={<SearchOutlined />} type="primary" onClick={fetchSettlements}>
              查询
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出报表
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={settlements}
          loading={loading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="确认结算"
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form
          form={form}
          onFinish={handleSettlement}
          layout="vertical"
        >
          <Form.Item
            label="收款银行"
            name="bankName"
            rules={[{ required: true, message: '请输入收款银行' }]}
          >
            <Input prefix={<BankOutlined />} placeholder="请输入收款银行" />
          </Form.Item>
          <Form.Item
            label="收款账号"
            name="bankAccount"
            rules={[{ required: true, message: '请输入收款账号' }]}
          >
            <Input prefix={<DollarOutlined />} placeholder="请输入收款账号" />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreSettlement; 
