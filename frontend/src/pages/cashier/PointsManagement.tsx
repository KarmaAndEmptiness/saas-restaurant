import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Row,
  Col,
  Statistic,
  Tabs,
  Timeline,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  MinusOutlined,
  SwapOutlined,
  GiftOutlined,
  ShoppingOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { 
  searchMembers, 
  getPointsBalance, 
  getPointsHistory,
  operatePoints,
  type Member 
} from '../../api/cashier';
import { debounce } from 'lodash';

interface PointsHistoryRecord {
  id: string;
  type: 'earn' | 'redeem' | 'expire' | 'adjust';
  points: number;
  balance: number;
  description: string;
  createTime: string;
  operator: string;
}

interface PointsOperationForm {
  points: number;
  description: string;
}

const PointsManagement: React.FC = () => {
  const [member, setMember] = useState<Member & { points: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [operationType, setOperationType] = useState<'earn' | 'redeem' | 'adjust'>('earn');
  const [pointsRecords, setPointsRecords] = useState<PointsHistoryRecord[]>([]);
  const [form] = Form.useForm();

  // 防抖处理的会员搜索
  const handleSearch = debounce(async (phone: string) => {
    if (!phone) return;
    
    setLoading(true);
    try {
      // 搜索会员
      const response = await searchMembers(phone);
      const members = response.data;
      if (members && members.length > 0) {
        const memberData = members[0];
        
        // 获取会员积分
        const pointsResponse = await getPointsBalance(memberData.id!);
        const memberWithPoints = {
          ...memberData,
          points: pointsResponse.data.points
        };
        setMember(memberWithPoints);

        // 获取积分历史
        const historyResponse = await getPointsHistory(memberData.id!);
        setPointsRecords(historyResponse.data);
      } else {
        message.warning('未找到会员信息');
        setMember(null);
        setPointsRecords([]);
      }
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败，请重试！');
      setMember(null);
      setPointsRecords([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  // 处理积分操作
  const handlePointsOperation = async (values: PointsOperationForm) => {
    if (!member) return;
    
    setLoading(true);
    try {
      // 调用积分操作API
      await operatePoints({
        memberId: member.id!,
        points: values.points,
        type: operationType === 'redeem' ? 'redeem' : 'earn',
        description: values.description
      });

      // 更新会员积分
      const pointsResponse = await getPointsBalance(member.id!);
      setMember(prev => prev ? { ...prev, points: pointsResponse.data.points } : null);

      // 更新积分历史
      const historyResponse = await getPointsHistory(member.id!);
      setPointsRecords(historyResponse.data);

      message.success('操作成功！');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<PointsHistoryRecord>['columns'] = [
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const typeMap = {
          earn: { color: 'success', text: '获得', icon: <PlusOutlined /> },
          redeem: { color: 'warning', text: '使用', icon: <MinusOutlined /> },
          expire: { color: 'error', text: '过期', icon: <ClockCircleOutlined /> },
          adjust: { color: 'processing', text: '调整', icon: <SwapOutlined /> },
        };
        const { color, text, icon } = typeMap[type as keyof typeof typeMap];
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '积分变动',
      dataIndex: 'points',
      key: 'points',
      width: 120,
      render: (points) => (
        <span style={{ color: points >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {points >= 0 ? '+' : ''}{points}
        </span>
      ),
    },
    {
      title: '积分余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 120,
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 120,
    },
  ];

  const items = [
    {
      key: 'records',
      label: '积分记录',
      children: (
        <Table
          columns={columns}
          dataSource={pointsRecords}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      ),
    },
    {
      key: 'timeline',
      label: '积分时间线',
      children: (
        <Timeline
          mode="left"
          items={pointsRecords?.map(record => ({
            color: record.type === 'earn' ? 'green' : record.type === 'redeem' ? 'orange' : 'blue',
            label: record.createTime,
            children: (
              <div>
                <p>
                  {record.type === 'earn' ? '获得积分：' : '使用积分：'}
                  <span style={{ color: record.type === 'earn' ? '#52c41a' : '#ff4d4f' }}>
                    {record.type === 'earn' ? '+' : ''}{record.points}
                  </span>
                </p>
                <p>{record.description}</p>
                <p>操作人：{record.operator}</p>
              </div>
            ),
          }))}
        />
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={24}>
          <Col span={8}>
            <Input.Search
              placeholder="输入会员手机号查询"
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              loading={loading}
            />
          </Col>
          <Col span={16}>
            <Space size="middle" style={{ float: 'right' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setOperationType('earn');
                  setModalVisible(true);
                }}
                disabled={!member}
              >
                增加积分
              </Button>
              <Button
                icon={<MinusOutlined />}
                onClick={() => {
                  setOperationType('redeem');
                  setModalVisible(true);
                }}
                disabled={!member}
              >
                扣减积分
              </Button>
              <Button
                icon={<SwapOutlined />}
                onClick={() => {
                  setOperationType('adjust');
                  setModalVisible(true);
                }}
                disabled={!member}
              >
                调整积分
              </Button>
            </Space>
          </Col>
        </Row>

        {member && (
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="当前积分"
                  value={member.points}
                  prefix={<GiftOutlined />}
                />
              </Card>
            </Col>
            <Col span={18}>
              <Card>
                <Row gutter={24}>
                  <Col span={8}>
                    <p><UserOutlined /> 会员姓名：{member.name}</p>
                    <p>会员编号：{member.id}</p>
                  </Col>
                  <Col span={8}>
                    <p>联系电话：{member.phone}</p>
                    <p>会员等级：<Tag color="gold">{member.level?.toUpperCase() || '普通会员'}</Tag></p>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}

        {member && (
          <Card style={{ marginTop: 24 }}>
            <Tabs items={items} />
          </Card>
        )}
      </Card>

      <Modal
        title={`${operationType === 'earn' ? '增加' : operationType === 'redeem' ? '扣减' : '调整'}积分`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handlePointsOperation} layout="vertical">
          <Form.Item
            name="points"
            label="积分数量"
            rules={[
              { required: true, message: '请输入积分数量' },
              { type: 'number', min: 1, message: '积分数量必须大于0' },
              {
                validator: (_, value) => {
                  if (operationType === 'redeem' && member && value > member.points) {
                    return Promise.reject(new Error('扣减积分不能大于当前积分'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="操作说明"
            rules={[{ required: true, message: '请输入操作说明' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointsManagement; 
