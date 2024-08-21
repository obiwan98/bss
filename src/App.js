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
import BookAdd from './components/content/books/BookAdd';
import BookList from './components/content/books/BookList';

const { Header, Content, Sider, Footer } = Layout;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider breakpoint="lg" collapsedWidth="0" style={{ background: 'white'}}>
            <div className="logo" style={{ padding: '16px', textAlign: 'center', color: 'white', height: '64px' }}>
              <LogoText />
            </div>
            <AppMenu />
          </Sider>
          <Layout>
            <Header className="header">
              <Navbar />
            </Header>
            <Content className="site-layout-content">
              <Routes >
                <Route path="/signup" element={<SignUp />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Home />} /> 
                <Route path="/books/BookAdd" element={<BookAdd />} />
                <Route path="/books/BookList" element={<BookList />} />
                <Route path="/users/UserList" element={<UserList />} />
              </Routes >
            </Content>
            <Footer style={{ textAlign: 'center' }}>BSS ©2024 Created with Ant Design</Footer>
          </Layout>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
