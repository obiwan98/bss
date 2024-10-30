import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
const UserContext = createContext(null);

// AuthProvider 컴포넌트
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // localStorage에서 초기 사용자 상태를 가져옴
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 초기 사용자 그룹의 리더 구하기
  const [leader, setLeader] = useState(null);
  const getLeader = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL +
          `/api/users/group/${user?.group?._id}/role/66a0bbfe8d7e45a08668b30f/info`
      );
      setLeader(response.data.leaders[1]);
    } catch (error) {
      console.error('Error fetching dataList:', error);
    }
  };

  useEffect(() => {
    // user 상태가 변경될 때마다 localStorage에 저장
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      getLeader();
    } else {
      localStorage.removeItem('user');
      setLeader(null);
    }
  }, [user]);

  const userLeader = {
    ...user,
    leader: leader,
  };

  return (
    <UserContext.Provider value={{ user: userLeader, setUser }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
