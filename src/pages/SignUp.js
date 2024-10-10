import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/content/SignUpForm';

const SignUp = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRolesAndGroups = async () => {
      try {
        const rolesResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/roles');
        const groupsResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/groups');
        setRoles(rolesResponse.data.roles);
        setGroups(groupsResponse.data.groups);
      } catch (error) {
        console.error('Error fetching roles and groups:', error);
        setErrorMessage('Error fetching roles and groups');
      }
    };

    fetchRolesAndGroups();
  }, []);

  const handleFinish = async (values) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/api/users/signup', {
        email: values.email,
        name: values.name,
        password: values.password,
        role: values.role,
        group: values.group,
      });
      alert(response.data.message);
      navigate('/home');
    } catch (error) {
      console.error('Error during signup:', error.response ? error.response.data : error.message);
      setErrorMessage(`Error signing up: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>
      <SignUpForm
        roles={roles}
        groups={groups}
        errorMessage={errorMessage}
        onFinish={handleFinish}
      />
    </div>
  );
}

export default SignUp;
