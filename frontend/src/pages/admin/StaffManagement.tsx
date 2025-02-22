import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  // UploadOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
// import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd/es/upload';
import styled from '@emotion/styled';
import { staff } from '@/api/admin';
import type { StaffMember } from '@/api/admin';
import type { TableProps } from 'antd';

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
`;

const StaffManagement: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [searchForm] = Form.useForm();

  // 获取员工列表
  const fetchStaffList = async () => {
    setLoading(true);
    try {
      const response = await staff.list();
      setStaffList(response.data);
    } catch (error) {
      console.error('获取员工列表失败:', error);
      message.error('获取员工列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  const handleAdd = () => {
    setEditingStaff(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: StaffMember) => {
    setEditingStaff(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await staff.delete(id);
      message.success('删除成功');
      fetchStaffList();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingStaff) {
        // 更新员工信息
        await staff.update(editingStaff.id, values);
        message.success('更新成功');
      } else {
        // 添加新员工
        await staff.create(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      fetchStaffList();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('请填写完整信息');
    }
  };

  const handleSearch = async () => {
    const values = await searchForm.validateFields();
    setLoading(true);
    try {
      const response = await staff.list();
      let filteredStaff = response.data;

      // 根据搜索条件筛选
      if (values.name) {
        filteredStaff = filteredStaff.filter((staff: StaffMember) =>
          staff.name.toLowerCase().includes(values.name.toLowerCase())
        );
      }
      if (values.role) {
        if (values.role === 'all') {
          filteredStaff = filteredStaff.filter((staff: StaffMember) =>
            staff.role === 'admin' || staff.role === 'cashier' || staff.role === 'finance' || staff.role === 'marketing'
          );
        } else {
          filteredStaff = filteredStaff.filter((staff: StaffMember) =>
            staff.role === values.role
          );
        }
      }
      if (values.status) {
        if (values.status === 'all') {
          filteredStaff = filteredStaff.filter((staff: StaffMember) =>
            staff.status === 'active' || staff.status === 'inactive'
          );
        } else {
          filteredStaff = filteredStaff.filter((staff: StaffMember) =>
            staff.status === values.status
          );
        }
      }

      setStaffList(filteredStaff);
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await staff.export();
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx,.xls',
    showUploadList: false,
    customRequest: async ({ file }) => {
      try {
        await staff.import(file as File);
        message.success('导入成功');
        fetchStaffList();
      } catch (error) {
        console.error('导入失败:', error);
        message.error('导入失败');
      }
    },
  };

  const columns: TableProps<StaffMember>['columns'] = [
    {
      title: '员工ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors: Record<string, string> = {
          admin: 'blue',
          cashier: 'green',
          finance: 'gold',
          marketing: 'purple',
        };
        return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <PhoneOutlined />
            {record.phone}
          </Space>
          <Space>
            <MailOutlined />
            {record.email}
          </Space>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '在职' : '离职'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该员工吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <TopBar>
        <SearchBar>
          <Form form={searchForm} layout="inline">
            <Form.Item name="name" label="姓名">
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="role" label="角色">
              <Select style={{ width: 120 }} placeholder="请选择角色">
                <Option value="all">全部</Option>
                <Option value="admin">管理员</Option>
                <Option value="cashier">收银员</Option>
                <Option value="finance">财务</Option>
                <Option value="marketing">营销</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select style={{ width: 120 }} placeholder="请选择状态">
                <Option value="all">全部</Option>
                <Option value="active">在职</Option>
                <Option value="inactive">离职</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
            </Form.Item>
          </Form>
        </SearchBar>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加员工
          </Button>
          <Upload {...uploadProps}>
            <Button icon={<ImportOutlined />}>导入</Button>
          </Upload>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
        </Space>
      </TopBar>

      <TableCard>
        <Table
          columns={columns}
          dataSource={staffList}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </TableCard>

      <Modal
        title={editingStaff ? '编辑员工' : '添加员工'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active' }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="cashier">收银员</Select.Option>
              <Select.Option value="finance">财务</Select.Option>
              <Select.Option value="marketing">营销</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: '请选择部门' }]}
          >
            <Select placeholder="请选择部门">
              <Select.Option value="管理部">管理部</Select.Option>
              <Select.Option value="收银部">收银部</Select.Option>
              <Select.Option value="财务部">财务部</Select.Option>
              <Select.Option value="营销部">营销部</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value="active">在职</Select.Option>
              <Select.Option value="inactive">离职</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default StaffManagement; 