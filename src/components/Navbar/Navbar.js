import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import * as AuthActions from '../../redux/actions/auth.js';
import * as ViewActions from '../../redux/actions/view';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import './Navbar.css'
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMenuOpen: false
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      userMenuOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      userMenuOpen: false,
    });
  };

  logout() {
    const { actions } = this.props;
    actions.logout()
    this.routerPush('/login')
  }

  routerPush (path) {
    this.props.dispatch(push(path))
  }

  render() {
    const { auth, view, path, actions } = this.props
    return (
      <div className="navbar-wrapper">
        <div className="navbar flex-row flex-center">
          <a className="nav-brand-text"
            onClick={() => {
              this.routerPush('/')
            }}>
            WEALTHIE
          </a>
            <div className="login-signup-wrapper">
              { auth.isLogin ? (
                <div className="flex-row flex-center">
                  <div className="raleway">
                    <div className="flex-row flex-center"
                      onTouchTap={this.handleTouchTap}
                      style={{cursor: "pointer"}}>
                      <span>{auth.name}</span>
                      <FontIcon
                        className="material-icons"
                        style={{fontSize: "20px"}}>
                        keyboard_arrow_down
                      </FontIcon>
                    </div>
                    <Popover
                      open={this.state.userMenuOpen}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      onRequestClose={this.handleRequestClose}
                      >
                      {
                        auth.role !== 1 ? (
                          <Menu>
                            <MenuItem primaryText="Dashboard"
                              onClick={()=>{
                                this.routerPush('/dashboard')
                                this.handleRequestClose()
                              }}
                              />
                            <MenuItem primaryText="Client Book"
                              onClick={()=>{
                                this.routerPush('/dashboard/clients')
                                this.handleRequestClose()
                              }}
                              />
                            <MenuItem primaryText="Sign out"
                              onClick={()=>{
                                this.logout()
                                this.handleRequestClose()
                              }}
                              />
                          </Menu>
                        ) : (
                          <Menu>
                            <MenuItem primaryText="Dashboard"
                              onClick={()=>{
                                this.routerPush('/dashboard')
                                this.handleRequestClose()
                              }}
                              />
                            <MenuItem primaryText="Sign out"
                              onClick={()=>{
                                this.logout()
                                this.handleRequestClose()
                              }}
                              />
                          </Menu>
                        )
                      }
                    </Popover>
                  </div>
                </div>
              ) : (
                <div className="flex-row">
                  <div className="flex-row flex-center" style={{marginRight: "16px"}}>
                    <FlatButton
                      label="Log In"
                      hoverColor="transparent"
                      style={{color: "#448aff"}}
                      onClick={() => {
                        this.routerPush('/login')
                      }}
                      />
                    <FlatButton
                      label="Sign up"
                      hoverColor="transparent"
                      style={{color: "#448aff"}}
                      onClick={() => {
                        this.routerPush('/signup')
                      }}
                      />
                  </div>
                  { path !== '/getlisted' && (
                    <FlatButton
                      backgroundColor="#00c853"
                      hoverColor="#43a047"
                      rippleColor="#B2DFDB"
                      label="GET LISTED TODAY"
                      style={{color: "#FFF"}}
                      onClick={() => {
                        this.routerPush('/getlisted')
                      }}
                      />
                  )}
                </div>
              )}
            </div>
            <IconButton className="nav-menu" onTouchTap={()=>{
                actions.setViewDrawerStatus(!view.drawer)
              }}>
              <FontIcon className="material-icons" color="rgb(83, 104, 128)">menu</FontIcon>
            </IconButton>
          </div>
        </div>
      );
    }
  }

  const mapStatesToProps = (states) => {
    return {
      auth: states.auth,
      view: states.view
    };
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      dispatch,
      actions: bindActionCreators(Object.assign({}, AuthActions, ViewActions), dispatch)
    };
  }

  export default connect(mapStatesToProps, mapDispatchToProps)(Navbar);
