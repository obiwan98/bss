import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

function SignUp({ setIsLoggedIn }) {
  const history = useHistory();
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRolesAndGroups = async () => {
      try {
        const rolesResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/roles');
        const groupsResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/groups');
        setRoles(rolesResponse.data);
        setGroups(groupsResponse.data);
      } catch (error) {
        console.error('Error fetching roles and groups:', error);
        setErrorMessage('Error fetching roles and groups');
      }
    };

    fetchRolesAndGroups();
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/api/users/signup', {
        email: values.email,
        password: values.password,
        role: values.role,
        group: values.group,
      });
      alert(response.data.message);
      const token = response.data.token; // 실제 회원가입 로직에서 받은 토큰을 사용하세요.
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      history.push('/home');
    } catch (error) {
      console.error('Error during signup:', error.response ? error.response.data : error.message);
      setErrorMessage(`Error signing up: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>
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

export default SignUp;
