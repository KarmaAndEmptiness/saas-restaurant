import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  message,
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { 
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  type Campaign as APICampaign
} from '../../api/marketing';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 扩展API的Campaign接口，添加前端需要的字段
interface ExtendedCampaign extends APICampaign {
  targetAudience: string[];
  discount: number;
  participantCount: number;
  conversionRate: number;
}

const CampaignManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<ExtendedCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<ExtendedCampaign | null>(null);
  const [form] = Form.useForm();

  // 获取活动列表
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await getCampaigns();
      // 转换API数据格式为前端格式
      const formattedCampaigns = response.data.map((campaign: APICampaign): ExtendedCampaign => ({
        ...campaign,
        targetAudience: campaign.rules.targetAudience || [],
        discount: campaign.rules.discount || 0,
        participantCount: campaign.rules.participantCount || 0,
        conversionRate: campaign.rules.conversionRate || 0,
      }));
      setCampaigns(formattedCampaigns);
    } catch (error) {
      console.error('获取活动列表失败:', error);
      message.error('获取活动列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleAdd = () => {
    setEditingCampaign(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ExtendedCampaign) => {
    setEditingCampaign(record);
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCampaign(id);
      message.success('活动已删除');
      fetchCampaigns();
    } catch (error) {
      console.error('删除活动失败:', error);
      message.error('删除活动失败');
    }
  };

  const handleDuplicate = async (record: ExtendedCampaign) => {
    try {
      // 只保留需要的字段
      const { targetAudience, discount, name, description, startDate, endDate, type } = record;
      const newCampaignData = {
        name: `${name} (副本)`,
        description,
        startDate,
        endDate,
        type,
        status: 'scheduled' as const,
        rules: {
          targetAudience,
          discount,
          participantCount: 0,
          conversionRate: 0,
        }
      };
      await createCampaign(newCampaignData);
      message.success('活动已复制');
      fetchCampaigns();
    } catch (error) {
      console.error('复制活动失败:', error);
      message.error('复制活动失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange;
      const campaignData = {
        name: values.name,
        description: values.description,
        type: values.type,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        status: dayjs().isBefore(startDate) ? 'scheduled' as const : 'active' as const,
        rules: {
          targetAudience: values.targetAudience,
          discount: values.discount,
          participantCount: editingCampaign?.participantCount || 0,
          conversionRate: editingCampaign?.conversionRate || 0,
        }
      };

      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, campaignData);
        message.success('活动已更新');
      } else {
        await createCampaign(campaignData);
        message.success('活动已创建');
      }
      setModalVisible(false);
      fetchCampaigns();
    } catch (error) {
      console.error('保存活动失败:', error);
      message.error('保存失败，请检查表单信息');
    }
  };

  const getStatusBadge = (status: APICampaign['status']) => {
    const statusMap = {
      active: { status: 'success' as const, text: '进行中' },
      scheduled: { status: 'processing' as const, text: '未开始' },
      ended: { status: 'default' as const, text: '已结束' },
    };
    const { status: badgeStatus, text } = statusMap[status];
    return (
      <Space>
        <Badge status={badgeStatus} />
        <span>{text}</span>
      </Space>
    );
  };

  const columns: TableProps<ExtendedCampaign>['columns'] = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const typeMap = {
          discount: { color: 'blue', text: '折扣' },
          points: { color: 'green', text: '积分' },
          gift: { color: 'purple', text: '赠品' },
        };
        const { color, text } = typeMap[type as keyof typeof typeMap] || { color: 'default', text: type };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusBadge(status),
    },
    {
      title: '活动时间',
      key: 'date',
      width: 240,
      render: (_, record) => (
        <span>{record.startDate} 至 {record.endDate}</span>
      ),
    },
    {
      title: '目标会员',
      dataIndex: 'targetAudience',
      key: 'targetAudience',
      width: 200,
      render: (audience: string[]) => (
        <Space>
          {audience.map(level => {
            const colorMap: Record<string, string> = {
              all: 'blue',
              gold: 'gold',
              silver: 'default',
              bronze: 'brown',
            };
            return (
              <Tag color={colorMap[level]} key={level}>
                {level === 'all' ? '全部会员' : level.toUpperCase()}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: '参与人数',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 120,
      sorter: (a, b) => a.participantCount - b.participantCount,
    },
    {
      title: '转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 120,
      render: (rate) => `${rate}%`,
      sorter: (a, b) => a.conversionRate - b.conversionRate,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="复制">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicate(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建活动
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={campaigns}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingCampaign ? '编辑活动' : '创建活动'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'discount',
            targetAudience: ['all'],
          }}
        >
          <Form.Item
            name="name"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input placeholder="请输入活动名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="活动类型"
            rules={[{ required: true, message: '请选择活动类型' }]}
          >
            <Select>
              <Select.Option value="discount">折扣活动</Select.Option>
              <Select.Option value="points">积分活动</Select.Option>
              <Select.Option value="gift">赠品活动</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="活动时间"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="targetAudience"
            label="目标会员"
            rules={[{ required: true, message: '请选择目标会员' }]}
          >
            <Select mode="multiple" placeholder="请选择目标会员">
              <Select.Option value="all">全部会员</Select.Option>
              <Select.Option value="gold">黄金会员</Select.Option>
              <Select.Option value="silver">白银会员</Select.Option>
              <Select.Option value="bronze">青铜会员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount"
            label="优惠力度"
            rules={[{ required: true, message: '请输入优惠力度' }]}
          >
            <InputNumber
              min={0}
              max={100}
              addonAfter="%"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ required: true, message: '请输入活动描述' }]}
          >
            <TextArea rows={4} placeholder="请输入活动描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CampaignManagement; 
