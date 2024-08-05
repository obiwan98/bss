import { Button, Form, Input, Modal, Select, Table, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

const { Option } = Select;

const UserList = () => {
  const [filteredUsers, setFilteredUsers] = useState([]); // 필터링된 사용자 데이터를 저장
  const [selectedTeam, setSelectedTeam] = useState(''); // 선택된 팀의 ID를 저장
	const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
	const [groups, setGroups] = useState([]); // 팀 데이터를 저장
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
	const [form] = Form.useForm();

  // 팀 데이터 가져오기 (컴포넌트가 처음 렌더링될 때 한 번)
  useEffect(() => {
    if(!isLoggedIn){
      navigate('/login');
      return;
    }
    const fetchRolesAndGroups = async () => {
      try {
        const rolesResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/roles');
        const groupsResponse = await axios.get(process.env.REACT_APP_API_URL + '/api/groups');
        setRoles(rolesResponse.data);
        setGroups(groupsResponse.data);
      } catch (error) {
        console.error('Error fetching roles and groups:', error);
        message.error('Error fetching roles and groups');
      }
    };

    fetchRolesAndGroups();
  }, [isLoggedIn, navigate]);

	// 모달 열기
  const showModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      role: user.role._id,
      group: user.group._id,
    });
    setIsModalVisible(true);
  };

  // 모달 닫기
  const handleCancel = () => {
    setIsModalVisible(false);
  };

	const getFilteredUser = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
      const allUsers = response.data; // 모든 사용자 데이터를 가져옴

      // 팀별 필터링 (선택된 팀이 있을 경우)
      if (selectedTeam) {
        const filtered = allUsers.filter((user) => user.group._id === selectedTeam);
        setFilteredUsers(filtered); // 필터링된 데이터를 설정
      } else {
        setFilteredUsers(allUsers); // 선택된 팀이 없으면 모든 사용자 표시
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
	};
  // 조회 버튼 클릭 시 사용자 데이터를 가져오고 필터링하는 함수
  const handleSearch = async () => {
    getFilteredUser();
  };

  // 팀 선택 시 선택된 팀 ID를 설정하는 함수
  const handleTeamChange = (value) => {
    setSelectedTeam(value); // 선택된 팀의 ID를 설정
  };

	// 역할 및 팀 정보 업데이트
  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem('token');
			if (!token) return;

      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${selectedUser._id}`, {
        role: values.role,
        group: values.group,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

      message.success('사용자 정보가 성공적으로 업데이트되었습니다.', 2);
      setIsModalVisible(false);
      // 사용자 목록 갱신
      getFilteredUser();
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('사용자 정보를 업데이트하는 중 오류가 발생했습니다.', 2);
    }
  };

  // 테이블에 표시할 컬럼 정의
  const columns = [
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
			width: 300,
      align: 'center', 
    },
    {
      title: '역할',
      dataIndex: ['role', 'roleName'], // 중첩된 객체 접근
      key: 'roleName',
			width: 200,
      align: 'center', 
    },
    {
      title: '팀',
      dataIndex: ['group', 'team'], // 중첩된 객체 접근
      key: 'team',
			width: 200,
      align: 'center', 
    },
    {
      title: '가입일',
      dataIndex: 'signupDate', // 중첩된 객체 접근
      key: 'signupDate',
			render: (signupDate) => dayjs(signupDate).format('YYYY-MM-DD'),
			width: 200,
      align: 'center', 
    },
    {
      title: '수정',
      key: 'action',
      render: (_, user) => (
        <Button type="primary" onClick={() => showModal(user)}>
          상세 정보
        </Button>
      ),
			width: 200,
      align: 'center', 
    },
  ];

  return (
    <div className="user-list-container">
      <h2>사용자 목록 조회</h2>
      <div className="filter-container">
        {/* 팀 선택 드롭다운 */}
        <Select
          style={{ width: 200, marginRight: 10 }}
          onChange={handleTeamChange}
          value={selectedTeam}
        >
          <Option value="">전체</Option> {/* 전체 선택 옵션 */}
          {groups.map((group) => (
            <Option key={group._id} value={group._id}>
              {group.team} {/* 팀 이름 표시 */}
            </Option>
          ))}
        </Select>
        {/* 조회 버튼 */}
        <Button type="primary" onClick={handleSearch}>
          조회
        </Button>
      </div>
      {/* 사용자 데이터를 표시하는 테이블 */}
      <Table
        dataSource={filteredUsers} // 필터링된 사용자 데이터
        columns={columns} // 테이블 컬럼 설정
        rowKey={(record) => record._id} // 고유 키 설정
        pagination={{ pageSize: 5 }} // 페이지네이션 설정
        style={{ marginTop: 20 }}
      />
			<Modal
        title="사용자 상세 정보"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
					<Form.Item 
						label="Email"
						name="email"
					>
						<Input disabled />
					</Form.Item>
          <Form.Item
            label="역할"
            name="role"
            rules={[{ required: true, message: '역할을 선택하세요!' }]}
          >
            <Select>
              {roles.map((role) => (
                <Option key={role._id} value={role._id}>
                  {role.roleName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="팀"
            name="group"
            rules={[{ required: true, message: '팀을 선택하세요!' }]}
          >
            <Select>
              {groups.map((group) => (
                <Option key={group} value={group._id}>
                  {group.office} - {group.part} - {group.team}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
