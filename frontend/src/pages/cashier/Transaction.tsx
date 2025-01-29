import React, { useState } from 'react';
import {
  Row,
  Col,
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
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  CreditCardOutlined,
  PrinterOutlined,
  UserOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import { 
  searchMembers, 
  createTransaction, 
  getPointsBalance,
  operatePoints,
  type Member,
  type Transaction as TransactionType
} from '../../api/cashier';
import { debounce } from 'lodash';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface AddItemFormValues {
  name: string;
  price: number;
  quantity: number;
}

interface PaymentFormValues {
  paymentMethod: 'cash' | 'wechat' | 'alipay' | 'card';
  amount: number;
  usePoints?: number;
}

const Transaction: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [searchModal, setSearchModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<AddItemFormValues>();

  // 防抖处理的会员搜索
  const handleMemberSearch = debounce(async (phone: string) => {
    if (!phone) return;
    
    setLoading(true);
    try {
      const response = await searchMembers(phone);
      const members = response.data;
      if (members && members.length > 0) {
        const memberData = members[0];
        // 获取会员积分
        const pointsResponse = await getPointsBalance(memberData.id!);
        setMember({
          ...memberData,
          points: pointsResponse.data.points
        });
      } else {
        message.warning('未找到会员信息');
        setMember(null);
      }
    } catch (error) {
      console.error('搜索会员失败:', error);
      message.error('搜索会员失败');
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, 500);

  // 添加商品到订单
  const handleAddItem = (values: AddItemFormValues) => {
    const newItem: OrderItem = {
      id: `ITEM${Date.now()}`,
      name: values.name,
      price: values.price,
      quantity: values.quantity,
      total: values.price * values.quantity,
    };
    setOrderItems([...orderItems, newItem]);
    form.resetFields();
    setSearchModal(false);
  };

  // 移除商品
  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // 处理支付
  const handlePayment = async (values: PaymentFormValues) => {
    if (!member) {
      message.error('请先选择会员');
      return;
    }

    setLoading(true);
    try {
      // 创建交易记录
      const transactionData: TransactionType = {
        memberId: member.id!,
        amount: values.amount,
        type: 'consumption',
        paymentMethod: values.paymentMethod,
        items: orderItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        usePoints: values.usePoints
      };

      await createTransaction(transactionData);

      // 如果使用了积分，需要扣除积分
      if (values.usePoints && values.usePoints > 0) {
        await operatePoints({
          memberId: member.id!,
          points: values.usePoints,
          type: 'redeem',
          description: `消费抵扣积分 ${values.usePoints} 分`
        });
      }

      // 计算获得的积分（假设消费1元获得1积分）
      const earnPoints = Math.floor(values.amount);
      if (earnPoints > 0) {
        await operatePoints({
          memberId: member.id!,
          points: earnPoints,
          type: 'earn',
          description: `消费获得积分 ${earnPoints} 分`
        });
      }

      message.success('支付成功！');
      setPaymentModal(false);
      // 清空购物车
      setOrderItems([]);
      // 更新会员积分
      const pointsResponse = await getPointsBalance(member.id!);
      setMember(prev => prev ? { ...prev, points: pointsResponse.data.points } : null);
      // 打印小票
      handlePrint();
    } catch (error) {
      console.error('支付失败:', error);
      message.error('支付失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 打印小票
  const handlePrint = () => {
    // 实现打印逻辑
    message.info('正在打印小票...');
  };

  const columns: TableProps<OrderItem>['columns'] = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '小计',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `¥${total.toFixed(2)}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          onClick={() => handleRemoveItem(record.id)}
        >
          删除
        </Button>
      ),
    },
  ];

  const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div>
      <Row gutter={24}>
        <Col span={16}>
          <Card title="购物车">
            <Space style={{ marginBottom: 16 }} size="middle">
              <Button
                type="primary"
                icon={<BarcodeOutlined />}
                onClick={() => setSearchModal(true)}
              >
                扫码/搜索商品
              </Button>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                disabled={orderItems.length === 0}
              >
                打印小票
              </Button>
            </Space>
            <Table
              columns={columns}
              dataSource={orderItems}
              pagination={false}
              rowKey="id"
            />
            <Row justify="end" style={{ marginTop: 16 }}>
              <Col>
                <Statistic
                  title="总计"
                  value={totalAmount}
                  precision={2}
                  prefix="¥"
                  style={{ marginRight: 32 }}
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  size="large"
                  icon={<CreditCardOutlined />}
                  onClick={() => setPaymentModal(true)}
                  disabled={orderItems.length === 0}
                >
                  结算
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="会员信息">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Input.Search
                placeholder="输入会员手机号查询"
                enterButton={<SearchOutlined />}
                onSearch={handleMemberSearch}
                loading={loading}
              />
              {member && (
                <div>
                  <p>
                    <UserOutlined /> 会员姓名：{member.name}
                  </p>
                  <p>会员编号：{member.id}</p>
                  <p>联系电话：{member.phone}</p>
                  <p>
                    会员等级：
                    <Tag color="gold">{member.level?.toUpperCase() || '普通会员'}</Tag>
                  </p>
                  <p>可用积分：{member.points || 0}</p>
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title="添加商品"
        open={searchModal}
        onCancel={() => setSearchModal(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddItem} layout="vertical">
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            name="price"
            label="单价"
            rules={[{ required: true, message: '请输入单价' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入单价"
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="数量"
            initialValue={1}
            rules={[{ required: true, message: '请输入数量' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              添加到购物车
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="收银结算"
        open={paymentModal}
        onCancel={() => setPaymentModal(false)}
        footer={null}
      >
        <Form onFinish={handlePayment} layout="vertical">
          <Form.Item
            name="paymentMethod"
            label="支付方式"
            rules={[{ required: true, message: '请选择支付方式' }]}
          >
            <Select placeholder="请选择支付方式">
              <Select.Option value="cash">现金</Select.Option>
              <Select.Option value="wechat">微信支付</Select.Option>
              <Select.Option value="alipay">支付宝</Select.Option>
              <Select.Option value="card">银行卡</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="实收金额"
            rules={[{ required: true, message: '请输入实收金额' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入实收金额"
            />
          </Form.Item>
          {member && (
            <Form.Item name="usePoints" label="使用积分">
              <InputNumber
                min={0}
                max={member.points}
                style={{ width: '100%' }}
                placeholder="请输入使用积分"
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认支付
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Transaction; 
