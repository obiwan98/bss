import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    history.push('/login');
  };

  return (
    <div className="navbar">
      {isLoggedIn ? (
        <button onClick={handleLogout} className="logout-button">로그아웃</button>
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
