import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';

class App extends Component {
  render() {
    return (
      <MyProvider>
        <BrowserRouter>
          <Login />
          <Main />
        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;
