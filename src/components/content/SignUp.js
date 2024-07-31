import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Content.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchRolesAndGroups = async () => {
      try {
        const rolesResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/roles');
        const groupsResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/groups');
        setRoles(rolesResponse.data);
        setGroups(groupsResponse.data);
      } catch (error) {
        console.error('Error fetching roles and groups:', error);
        alert('Error fetching roles and groups');
      }
    };

    fetchRolesAndGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/api/users/signup', {
        email,
        password,
        roles: [selectedRole],
        group: selectedGroup
      });
      alert(response.data.message);
      history.push('/login');
    } catch (error) {
      console.error('Error during signup:', error.response ? error.response.data : error.message);
      alert(`Error signing up: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signup-input"
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          required
          className="signup-select"
        >
          <option value="">역할 선택</option>
          {roles.map((role) => (
            <option key={role._id} value={role.role}>
              {role.roleName}
            </option>
          ))}
        </select>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          required
          className="signup-select"
        >
          <option value="">팀 선택</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.office} - {group.part} - {group.team}
            </option>
          ))}
        </select>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
