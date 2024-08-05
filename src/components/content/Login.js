import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate ();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
      return;
    }
  }, [isLoggedIn, navigate]);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/api/users/login', {
        email: values.email,
        password: values.password,
      });
      const token = response.data.token; // 실제 로그인 로직에서 받은 토큰을 사용하세요.
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      message.success("로그인이 성공하였습니다.", 2);
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error.response ? error.response.data : error.message);
      message.error(error.message, 2);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
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
