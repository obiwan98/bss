import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Content.css';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      history.push('/home');
      return;
    }
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/api/users/login', { email, password });

      localStorage.setItem('token', response.data.token);

      setIsLoggedIn(true);

      history.push('/home'); // 로그인 성공 후 Home 페이지로 이동
    } catch (error) {
      alert('Error logging in' + error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">로그인</button>
      </form>
    </div>
  );
}

export default Login;
