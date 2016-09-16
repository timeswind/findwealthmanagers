import React, { Component } from 'react';
// import { RouteTransition } from 'react-router-transition';
import './App.css';
import Navbar from './components/Navbar/Navbar'

class App extends Component {
  render() {
    return (
      <div>
        {this.props.location.pathname !== '/' ? (<Navbar></Navbar>) : null}
        {this.props.children}
      </div>
    );
  }
}

export default App;
