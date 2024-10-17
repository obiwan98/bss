import { useEffect, useState } from 'react';
import { fetchGroups, fetchRoles } from '../utils/api';

const useFetchRolesAndGroups = () => {
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);  // 로딩 상태 추가
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
				setLoading(true);  // 데이터를 가져오기 전에 로딩 상태로 설정
        const rolesData = await fetchRoles();
        const groupsData = await fetchGroups();
        setRoles(rolesData.roles);
        setGroups(groupsData.groups);
				
      } catch (error) {
        setErrorMessage('Error fetching roles and groups');
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    fetchData();
  }, []);

  return { roles, groups, loading, errorMessage };
};

export default useFetchRolesAndGroups;
