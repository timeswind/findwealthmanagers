import React, { Component } from 'react';
import Helmet from "react-helmet";
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import * as AuthActions from './redux/actions/auth';
import * as ViewActions from './redux/actions/view';
import { bindActionCreators } from 'redux';
import Navbar from './components/Navbar/Navbar'
import LoginSignupForm from './forms/LoginSignupForm/LoginSignupForm';
import './App.css';
const helmetPathTitles = {
  '/': 'Wealthie - Professional Financial Service For Everyone, Everywhere',
  '/search': 'Find the Best Advisors',
  '/getlisted': 'Get Listed and Make Connections',
  '/login': 'Wealthie - Login',
  '/dashboard': 'Wealthie - Dashboard',
  '/dashboard/clients': 'Client Book',
  '/dashboard/feedback': 'Feedback Tools',
  '/dashboard/calendar': 'Manage Calendar'
};

class App extends Component {
  logout() {
    const { actions } = this.props;
    actions.logout()
  }
  render() {
    const { loginModel, isLogin, role } = this.props.auth
    const { drawer } = this.props.view
    const { actions, dispatch, location, children } = this.props
    const { pathname } = location
    const showNavBar = pathname !== '/' && pathname !== '/internal'
    const { agentbook } =  this.props.functions
    return (
      <div>
        {!!helmetPathTitles[pathname] && (
          <Helmet title={helmetPathTitles[pathname]} />
        )}
        {showNavBar && (<Navbar path={pathname}></Navbar>)}
        {children}
        <Dialog
          title="Login"
          modal={false}
          autoScrollBodyContent={true}
          open={loginModel}
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
          <MenuItem onTouchTap={()=>{
              var win = window.open('https://blog.wealthie.co', '_blank')
              win.focus()
            }}>
            Blog
          </MenuItem>
          { isLogin ? (
            <div>
              {(role === 1 || role === 2 || role === 3) && (
                <MenuItem primaryText="Dashboard"
                  onClick={()=>{
                    dispatch(push('/dashboard'))
                    actions.setViewDrawerStatus(false)
                  }}
                  />
              )}
              {(role === 2 || role === 3) && (
                <MenuItem primaryText="Client Book"
                  onClick={()=>{
                    dispatch(push('/dashboard/clients'))
                    actions.setViewDrawerStatus(false)
                  }}
                  />
              )}
              {agentbook && (
                <MenuItem primaryText="Baseshop"
                  onClick={()=>{
                    dispatch(push('/dashboard/agents'))
                    actions.setViewDrawerStatus(false)
                  }}
                  />
              )}
              {(role === 101) && (
                <MenuItem primaryText="Manage"
                  onClick={()=>{
                    dispatch(push('/internal'))
                    actions.setViewDrawerStatus(false)
                  }}
                  />
              )}
              <MenuItem primaryText="Sign out"
                onClick={()=>{
                  this.logout()
                  actions.setViewDrawerStatus(false)
                }}
                />
            </div>
          ) : (
            <div>
              <MenuItem onTouchTap={() => {
                  dispatch(push('/login'))
                  actions.setViewDrawerStatus(false)
                }}>
                Login/Sign up
              </MenuItem>
              <MenuItem onTouchTap={() => {
                  dispatch(push('/getlisted'))
                  actions.setViewDrawerStatus(false)
                }}>
                Get Listed
              </MenuItem>
            </div>
          )}
        </Drawer>
      </div>
    );
  }
}

App = connect(
  states => {
    return {
      auth: states.auth,
      view: states.view,
      functions: states.functions
    };
  },
  dispatch => {
    return {
      dispatch,
      actions: bindActionCreators(Object.assign({}, AuthActions, ViewActions), dispatch)
    }
  }
)(App)

export default App;
