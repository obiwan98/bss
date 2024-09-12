import { Button, Form, Input, Modal, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const UserModalForm = ({
  isModalVisible,
  onCancel,
  form,
  roles,
  groups,
  onFinish,
}) => {
  return (
    <Modal title="사용자 상세 정보" open={isModalVisible} onCancel={onCancel} footer={null}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Name" name="name">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="역할"
          name="role"
          rules={[{ required: true, message: '역할을 선택하세요!' }]}
        >
          <Select>
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="팀"
          name="group"
          rules={[{ required: true, message: '팀을 선택하세요!' }]}
        >
          <Select>
            {groups.map((group) => (
              <Option key={group._id} value={group._id}>
                {group.office} - {group.part} - {group.team}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            저장
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModalForm;
