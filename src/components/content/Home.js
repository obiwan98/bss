import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function Home() {
  
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          history.push('/login');
          return;
        }

        const response = await axios.get(process.env.REACT_APP_API_URL + '/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        localStorage.removeItem('token'); // 토큰 삭제
        history.push('/login');
      }
    };

    fetchUser();
  }, [history]);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <h2 className="welcome-message">Welcome, {user.email}</h2>
      <p className="welcome-message">역할: {user.role.roleName}</p>
      <p className="welcome-message">팀: {user.group.office} - {user.group.part} - {user.group.team}</p>
    </div>
  );
}

export default Home;
