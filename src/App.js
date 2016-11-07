import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import * as AuthActions from './redux/actions/auth';
import * as ViewActions from './redux/actions/view';
import { bindActionCreators } from 'redux';
import Navbar from './components/Navbar/Navbar'
import LoginSignupForm from './forms/LoginSignupForm/LoginSignupForm';
import './App.css';

class App extends Component {
  render() {
    const { loginModel, isLogin } = this.props.auth
    const { drawer } = this.props.view
    const { actions } = this.props
    return (
      <div>
        {this.props.location.pathname !== '/' && (<Navbar path={this.props.location.pathname}></Navbar>)}
        {this.props.children}
        <Dialog
          title="Login"
          modal={false}
          autoScrollBodyContent={true}
          open={this.props.auth.loginModel}
          onRequestClose={()=>{
            actions.hideLoginModel()
          }}
          >
          <LoginSignupForm></LoginSignupForm>
        </Dialog>
        <Drawer
          docked={false}
          openSecondary={true}
          width={200}
          open={drawer}
          onRequestChange={(status) => actions.setViewDrawerStatus(status) }
          >
          { !isLogin && (
            <MenuItem
              onTouchTap={() => {
                this.routerPush('/login')
              }}
              >Login/Sign up</MenuItem>
          ) }
          <MenuItem
            onTouchTap={()=>{
              window.location.replace("https://blog.wealthie.co");
            }}
            >Blog</MenuItem>
        </Drawer>
      </div>
    );
  }
}

App = connect(
  states => {
    return {
      auth: states.auth,
      view: states.view
    };
  },
  dispatch => {
    return {
      actions: bindActionCreators(Object.assign({}, AuthActions, ViewActions), dispatch)
    }
  }
)(App)

export default App;
