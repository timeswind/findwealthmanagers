import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import * as AuthActions from './redux/actions/auth.js';
import { bindActionCreators } from 'redux';
import Navbar from './components/Navbar/Navbar'

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        {this.props.location.pathname !== '/' && (<Navbar path={this.props.location.pathname}></Navbar>)}
        {this.props.children}
        <Dialog
          title="Login"
          modal={false}
          open={this.props.auth.loginModel}
          onRequestClose={()=>{
            this.props.actions.hideLoginModel()
          }}
          >
          The actions in this window were passed in as an array of React objects.
        </Dialog>
      </div>
    );
  }
}

App = connect(
  state => {
    return {
      auth: state.auth
    };
  },
  dispatch => {
    return {
      actions: bindActionCreators(AuthActions, dispatch)
    }
  }
)(App)

export default App;
