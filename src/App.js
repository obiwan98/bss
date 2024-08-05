// src/App.js
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute';
import Home from './components/content/Home';
import Login from './components/content/Login';
import SignUp from './components/content/SignUp';
import LogoText from './components/logoText/LogoText';
import AppMenu from './components/menu/AppMenu';
import Navbar from './components/navbar/Navbar';
import './index.css';

const { Header, Content, Footer } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // 토큰이 있으면 true, 없으면 false
  }, []);

  return (
    <Router>
      <Layout className="layout">
        <Header className="header">
          <div className="header-left">
            <LogoText />
            <AppMenu />
          </div>
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </Header>
        <Content style={{ padding: '0 30px' }}>
          <div className="site-layout-content">
            <Switch>
              <Route path="/signup" render={(props) => <SignUp {...props} setIsLoggedIn={setIsLoggedIn} />}/>
              <Route path="/login" render={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />} />
              <AuthenticatedRoute path="/home" component={Home} />
              <Route path="/" render={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />} /> 
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>BSS ©2024 Created with Ant Design</Footer>
      </Layout>
    </Router>
  );
}

export default App;
