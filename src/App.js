import React, { Component } from 'react';
import { RouteTransition } from 'react-router-transition';
import './App.css';
import Navbar from './components/Navbar/Navbar'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <RouteTransition
          pathname={this.props.location.pathname}
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          >
          {this.props.children}
        </RouteTransition>
      </div>
    );
  }
}

export default App;
