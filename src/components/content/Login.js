import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      history.push('/home');
      return;
    }
  }, [history]);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/api/users/login', {
        email: values.email,
        password: values.password,
      });
      const token = response.data.token; // 실제 로그인 로직에서 받은 토큰을 사용하세요.
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      history.push('/home');
    } catch (error) {
      console.error('Error during login:', error.response ? error.response.data : error.message);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ maxWidth: '300px', margin: 'auto' }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Email을 입력해주세요.' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '패스워드를 입력해주세요.' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
