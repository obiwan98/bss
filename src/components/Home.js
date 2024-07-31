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
        history.push('/login');
      }
    };

    fetchUser();
  }, [history]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <p>Role: {user.role.roleName}</p>
      <p>Group: {user.group.office} - {user.group.part} - {user.group.team}</p>
    </div>
  );
}

export default Home;
