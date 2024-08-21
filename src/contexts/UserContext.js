import React, { createContext, useContext, useEffect, useState } from 'react';
const UserContext = createContext(null);

// AuthProvider 컴포넌트
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // localStorage에서 초기 사용자 상태를 가져옴
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // user 상태가 변경될 때마다 localStorage에 저장
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);