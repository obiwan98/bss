// src/App.js
import { Layout } from 'antd';
import 'antd/dist/reset.css';
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ApprovalEdit from './components/content/approval/ApprovalEdit';
import ApprovalList from './components/content/approval/ApprovalList';
import BookSearchButton from './components/content/approval/modal/BookSearchButton';
import LogoText from './components/logoText/LogoText';
import AppMenu from './components/menu/AppMenu';
import Navbar from './components/navbar/Navbar';
import { useUser } from './contexts/UserContext';
import './index.css';
import Home from './pages/Home';
import Login from './pages/Login';
import BookList from './pages/management/BookList';
import SignUp from './pages/SignUp';
import Test from './pages/test';
import UserList from './pages/users/UserList';

const { Header, Content, Sider, Footer } = Layout;

const App = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  useEffect(() => {
    const isTokenExpired = (token) => {
      if (!token) return true; // 토큰이 없으면 만료된 것으로 간주

      try {
        const payloadBase64 = token.split('.')[1]; // JWT의 payload 부분을 추출
        const decodedPayload = JSON.parse(atob(payloadBase64)); // Base64 디코딩
        const expirationTime = decodedPayload.exp * 1000; // exp는 초 단위이므로 밀리초로 변환

        return Date.now() > expirationTime; // 현재 시간과 만료 시간을 비교
      } catch (error) {
        console.error('Invalid token', error);
        return true; // 토큰이 잘못된 경우에도 만료된 것으로 간주
      }
    };

    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (!token || isTokenExpired(token)) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token'); // 토큰 삭제
        setUser(null);
        navigate('/login'); // 로그인 페이지로 리다이렉트
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: 'white' }}>
        <div
          className="logo"
          style={{
            padding: '16px',
            textAlign: 'center',
            color: 'white',
            height: '64px',
          }}
        >
          <LogoText />
        </div>
        <AppMenu />
      </Sider>
      <Layout>
        <Header className="header">
          <Navbar />
        </Header>
        <Content className="site-layout-content">
          <Routes>
            <Route path="/test" element={<Test />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/management/BookList" element={<BookList />} />
            <Route path="/users/UserList" element={<UserList />} />
            <Route path="/approval/list" element={<ApprovalList />} />
            <Route path="/approval/edit/:param" element={<ApprovalEdit />} />
            <Route path="/approval/bookSearch" element={<BookSearchButton />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>BSS ©2024 Created with Ant Design</Footer>
      </Layout>
    </Layout>
  );
};
export default App;
