import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Tree,
} from 'antd';
import type { Key } from 'antd/es/table/interface';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { roles, permissions } from '@/api/admin';
import type { Role, Permission } from '@/api/admin';

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

const PermissionManagement: React.FC = () => {
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [permissionList, setPermissionList] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // 获取角色和权限列表
  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        roles.list(),
        permissions.list(),
      ]);
      setRoleList(rolesResponse.data);
      setPermissionList(permissionsResponse.data);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Role) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await roles.delete(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await roles.update(editingRole.id, values);
        message.success('更新成功');
      } else {
        await roles.create(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('请填写完整信息');
    }
  };

  const handlePermissionModalOpen = (record: Role) => {
    setSelectedRole(record);
    setPermissionModalVisible(true);
  };

  const handlePermissionUpdate = async (checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] }) => {
    if (!selectedRole) return;
    try {
      const permissions = Array.isArray(checkedKeys)
        ? checkedKeys.map(String)
        : checkedKeys.checked.map(String);
      await roles.updatePermissions(selectedRole.id, permissions);
      message.success('权限更新成功');
      fetchData();
      setPermissionModalVisible(false);
    } catch (error) {
      console.error('更新权限失败:', error);
      message.error('更新权限失败');
    }
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <TeamOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Role) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<KeyOutlined />}
            onClick={() => handlePermissionModalOpen(record)}
          >
            权限设置
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该角色吗？"
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

  const treeData = permissionList?.map((permission) => ({
    title: permission.name,
    key: permission.id,
    children: undefined,
  })) || [];

  return (
    <>
      <TopBar>
        <div>
          <h2>角色权限管理</h2>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加角色
          </Button>
        </Space>
      </TopBar>

      <TableCard>
        <Table
          columns={columns}
          dataSource={roleList}
          loading={loading}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </TableCard>

      <Modal
        title={editingRole ? '编辑角色' : '添加角色'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="权限设置"
        open={permissionModalVisible}
        onOk={() => {
          if (selectedRole) {
            const checkedKeys = form.getFieldValue('permissions');
            handlePermissionUpdate(checkedKeys);
          }
        }}
        onCancel={() => setPermissionModalVisible(false)}
        width={600}
      >
        {selectedRole && (
          <Form form={form} initialValues={{ permissions: selectedRole.permissions }}>
            <Form.Item name="permissions">
              <Tree
                checkable
                treeData={treeData}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default PermissionManagement; 