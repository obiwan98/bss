// src/App.js
import { Layout } from 'antd';
import 'antd/dist/reset.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/content/Home';
import Login from './components/content/Login';
import SignUp from './components/content/SignUp';
import UserList from './components/content/users/UserList';
import LogoText from './components/logoText/LogoText';
import AppMenu from './components/menu/AppMenu';
import Navbar from './components/navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout className="layout">
          <Header className="header">
            <div className="header-left">
              <LogoText />
              <AppMenu />
            </div>
            <Navbar />
          </Header>
          <Content style={{ padding: '0 30px' }}>
            <div className="site-layout-content">
              <Routes >
                <Route path="/signup" element={<SignUp />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Login />} /> 
                <Route path="/users/UserList" element={<UserList />} />
              </Routes >
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>BSS ©2024 Created with Ant Design</Footer>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
