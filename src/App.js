import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar'
import Home from './views/Home/Home'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        {this.props.children || <Home/>}
      </div>
    );
  }
}

export default App;
