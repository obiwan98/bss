import { Form, message, Modal, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserFilter from '../../components/content/users/UserFilter';
import UserListTable from '../../components/content/users/UserListTable';
import UserModalForm from '../../components/content/users/UserModalForm';
import { useUser } from '../../contexts/UserContext';
import useFetchRolesAndGroups from '../../hooks/useFetchRolesAndGroups';

const UserList = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const { roles, groups, loading, errorMessage } = useFetchRolesAndGroups();

  const getFilteredUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allUsers = response.data.users;
      if (selectedTeam) {
        const filtered = allUsers.filter((user) => user.group._id === selectedTeam);
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(allUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsAdmin(user.role.role === 'Admin');
    getFilteredUser();
  }, [user, navigate, roles, groups, loading]);

	if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Spin size="large" /></div>;  // 로딩 중일 때는 로딩 메시지 표시
  }



  const handleSearch = async () => {
    getFilteredUser();
  };

  const handleDelete = (id) => {
    confirm({
      title: '사용자를 삭제하시겠습니까?',
      content: '이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        const token = localStorage.getItem('token');
        if (!token) return;

        axios
          .delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
            message.success('사용자 정보가 삭제되었습니다.', 2);
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
          });
      },
      onCancel() {
        console.log('삭제 취소됨');
      },
    });
  };

  const showModal = (recode) => {
    setSelectedUser(recode);
    form.setFieldsValue({
      email: recode.email,
      name: recode.name,
      role: recode.role._id,
      group: recode.group._id,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${selectedUser._id}`,
        {
          role: values.role,
          group: values.group,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        role: roles.find((r) => r._id === values.role),
        group: groups.find((g) => g._id === values.group),
      }));

      message.success('사용자 정보가 성공적으로 업데이트되었습니다.', 2);
      setIsModalVisible(false);
      getFilteredUser();
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('사용자 정보를 업데이트하는 중 오류가 발생했습니다.', 2);
    }
  };

  return (
    <div className="user-list-container">
      <h2>사용자 목록 조회</h2>
      <UserFilter
        groups={groups}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        onSearch={handleSearch}
      />
      <UserListTable
        users={filteredUsers}
        isAdmin={isAdmin}
        onDelete={handleDelete}
        onShowModal={showModal}
      />
      <UserModalForm
        isModalVisible={isModalVisible}
        onCancel={handleCancel}
        form={form}
        roles={roles}
        groups={groups}
        onFinish={handleUpdate}
      />
    </div>
  );
};

export default UserList;
