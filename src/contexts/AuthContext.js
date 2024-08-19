import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect, useState } from 'react';
export const AuthContext = createContext();


// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        setIsLoggedIn(true);
        // JWT 토큰 디코딩
        const decodedToken = jwtDecode(token);
console.log(decodedToken.exp * 1000);
console.log(Date.now());
        // 현재 시간과 만료 시간 비교
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
console.log(decodedToken.email);
console.log(decodedToken.role);
console.log(decodedToken.group);
console.log(decodedToken.name);
          setUserEmail(decodedToken.email);
          setUserRole(decodedToken.role);
          setUserGroup(decodedToken.group);
          setUserName(decodedToken.name);
        } else {
          console.log('Token has expired');
          localStorage.removeItem('token'); // 만료된 토큰은 제거
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token'); // 잘못된 토큰도 제거
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userEmail, userRole, userGroup, userName }}>
      {children}
    </AuthContext.Provider>
  );
};