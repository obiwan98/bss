import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(process.env.REACT_APP_API_URL + '/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    fetchUser();
  }, [isLoggedIn, setIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="navbar">
      {isLoggedIn ? (
        <>
          <Button icon={<UserOutlined />} type="link" className="user-info">
            {user ? `${user.email} [${user.role.roleName}, ${user.group.office} ${user.group.team}]` : '사용자'}
          </Button>
          
          <Button icon={<LogoutOutlined />} type="default" onClick={handleLogout}>로그아웃</Button>
        </>
      ) : (
        <>
          <Link to="/signup">회원가입</Link>
          <Link to="/login">로그인</Link>
        </>
      )}
    </div>
  );
}

export default Navbar;
