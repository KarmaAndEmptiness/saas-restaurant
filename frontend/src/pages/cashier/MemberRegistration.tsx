import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Row,
  Col,
  Space,
  Divider,
  Upload,
  Modal,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  CameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import dayjs from 'dayjs';
import { registerMember, searchMembers } from '../../api/cashier';
import type { Member } from '../../api/cashier';
import { debounce } from 'lodash';

const { Option } = Select;

interface MemberForm {
  name: string;          // 会员姓名
  phone: string;         // 手机号码
  email?: string;        // 电子邮箱（可选）
  gender?: 'male' | 'female' | 'other';  // 性别（可选）
  birthday: dayjs.Dayjs; // 生日，使用dayjs类型
  idCard: string;        // 身份证号
  address: string;       // 联系地址
  level: string;         // 会员等级
  source: string;        // 注册来源
}

const MemberRegistration: React.FC = () => {
  const [form] = Form.useForm<MemberForm>();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 防抖处理的手机号查重
  const checkPhoneExist = debounce(async (phone: string) => {
    try {
      const response = await searchMembers(phone);
      const members = response.data;
      if (members && members.length > 0) {
        return Promise.reject(new Error('该手机号已被注册'));
      }
    } catch (error) {
      console.error('查询手机号失败:', error);
    }
  }, 500);

  const handleSubmit = async (values: MemberForm) => {
    setLoading(true);
    try {
      // 转换数据格式
      const memberData: Member = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        gender: values.gender,
        birthday: values.birthday.format('YYYY-MM-DD'),
      };

      // 调用注册API
      await registerMember(memberData);
      
      message.success('会员注册成功！');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB！');
    }
    return isImage && isLt2M;
  };

  const uploadButton = (
    <div>
      <CameraOutlined />
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  return (
    <Card title="会员注册">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          level: 'bronze',
          source: 'store',
        }}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="手机号"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                    { validator: (_, value) => value ? checkPhoneExist(value) : Promise.resolve() }
                  ]}
                  validateTrigger={['onBlur', 'onChange']}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { type: 'email', message: '请输入正确的邮箱格式' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="idCard"
                  label="身份证号"
                  rules={[
                    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号' },
                  ]}
                >
                  <Input prefix={<IdcardOutlined />} placeholder="请输入身份证号" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="gender"
                  label="性别"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Select placeholder="请选择性别">
                    <Option value="male">男</Option>
                    <Option value="female">女</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="birthday"
                  label="生日"
                  rules={[{ required: true, message: '请选择生日' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="level"
                  label="会员等级"
                >
                  <Select>
                    <Option value="bronze">青铜会员</Option>
                    <Option value="silver">白银会员</Option>
                    <Option value="gold">黄金会员</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="联系地址"
            >
              <Input.TextArea rows={3} placeholder="请输入联系地址" />
            </Form.Item>

            <Form.Item
              name="source"
              label="注册来源"
            >
              <Select>
                <Option value="store">门店注册</Option>
                <Option value="online">线上注册</Option>
                <Option value="activity">活动推广</Option>
                <Option value="referral">会员推荐</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Form.Item label="会员头像">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
              <Space direction="vertical" size="large">
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => form.submit()}
                  loading={loading}
                  block
                >
                  提交注册
                </Button>
                <Button onClick={() => {
                  form.resetFields();
                  setFileList([]);
                }} block>
                  重置表单
                </Button>
              </Space>
            </div>
          </Col>
        </Row>

        <Divider />

        <div style={{ color: '#666', fontSize: '14px' }}>
          <p>注意事项：</p>
          <ol>
            <li>请确保填写的信息真实有效</li>
            <li>手机号将作为会员账号使用</li>
            <li>身份证号用于实名认证，请谨慎填写</li>
            <li>上传的头像将用于会员识别，请上传清晰的照片</li>
          </ol>
        </div>
      </Form>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Card>
  );
};

export default MemberRegistration; 