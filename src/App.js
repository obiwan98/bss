// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import AuthenticatedRoute from './components/AuthenticatedRoute';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
					<Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <AuthenticatedRoute path="/home" component={Home} />
          <Route path="/" component={Login} /> 
        </Switch>
      </div>
    </Router>
  );
}

export default App;
