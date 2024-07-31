import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      alert(process.env.REACT_APP_API_URL);
      
      const response = await axios.post(process.env.REACT_APP_API_URL + '/api/users/login', { email, password });

      localStorage.setItem('token', response.data.token);
      alert('Login successful');
      history.push('/home'); // 로그인 성공 후 Home 페이지로 이동
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
