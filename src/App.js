// src/App.js
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute';
import Home from './components/content/Home';
import Login from './components/content/Login';
import SignUp from './components/content/SignUp';
import Menu from './components/menu/Menu';
import Navbar from './components/navbar/Navbar';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // 토큰이 있으면 true, 없으면 false
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Menu />
        <div className="content">
          <Switch>
            <Route path="/signup" component={SignUp} />
            <Route path="/login" render={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />} />
            <AuthenticatedRoute path="/home" component={Home} />
            <Route path="/" render={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />} /> 
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
