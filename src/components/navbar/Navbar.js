import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const Navbar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="navbar">
      {user ? (
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
