import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const SignUpForm = ({ roles, groups, errorMessage, onFinish }) => {
  return (
    <div>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
      <Form
        name="signup"
        className="signup-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ maxWidth: '400px', margin: 'auto' }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Email을 입력해주세요.' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="name"
          rules={[{ required: true, message: '이름을 입력해주세요.' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="이름" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '패스워드를 입력해주세요' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="role"
          rules={[{ required: true, message: '역할을 선택해주세요.' }]}
        >
          <Select placeholder="역할 선택">
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="group"
          rules={[{ required: true, message: '팀을 선택해주세요.' }]}
        >
          <Select placeholder="팀 선택">
            {groups.map((group) => (
              <Option key={group._id} value={group._id}>
                {group.office} - {group.part} - {group.team}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="signup-form-button" block>
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignUpForm;
