import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const history = useHistory();

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
        setUser(null);
      }
    };

    fetchUser();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    history.push('/login');
  };

  return (
    <div className="navbar">
      {isLoggedIn ? (
        <>
        {user && (
            <div className="user-info">
              {user.email} [{user.role.roleName}, {user.group.team}]
            </div>
          )}
        <button onClick={handleLogout} className="logout-button">로그아웃</button>
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
