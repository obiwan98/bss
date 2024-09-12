import { message } from 'antd';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/content/LoginForm';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate ();

  useEffect(() => {
    if (user) {
      navigate('/home');
      return;
    }
  }, [user, navigate]);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/api/users/login', {
        email: email,
        password: password,
      });
      const token = response.data.token; // 실제 로그인 로직에서 받은 토큰을 사용하세요.
      localStorage.setItem('token', token);
      
      const decodedToken = jwtDecode(token);
      const userInfo = { email: decodedToken.email, role: decodedToken.role, group: decodedToken.group, name: decodedToken.name, loggedIn: true };
      setUser(userInfo);

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
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default Login;
