import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import * as AuthActions from '../../redux/actions/auth.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

const startListButtonStyle = {
  color: "#FFFFFF"
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
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
  }

  routerPush (path) {
    this.props.dispatch(push(path))
  }

  render() {

    return (
      <div className="navbar-wrapper">
        <div className="navbar flex-row flex-center">
          <a className="nav-brand-text"
            onClick={() => {
              this.routerPush('/')
            }}>
            WEALTHIE</a>
          { this.props.auth.isLogin ? (
            <div className="flex-row flex-center" style={{marginLeft: "auto"}}>
              <div className="raleway">
                <div className="flex-row flex-center"
                  onTouchTap={this.handleTouchTap}
                  style={{cursor: "pointer"}}>
                  <span>{this.props.auth.name}</span>
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
                  <Menu>
                    <MenuItem primaryText="Dashboard"
                      onClick={()=>{
                        this.routerPush('/dashboard')
                        this.handleRequestClose()
                      }}
                      />
                    <MenuItem primaryText="Client Book"
                      onClick={()=>{
                        this.routerPush('/clients')
                        this.handleRequestClose()
                      }}
                      />
                    <MenuItem primaryText="Help &amp; feedback"/>
                    <MenuItem primaryText="Sign out"
                      onClick={()=>{
                        this.logout()
                        this.handleRequestClose()
                      }}
                      />
                  </Menu>
                </Popover>
              </div>
            </div>
          ) : (
            <div className="flex-row" style={{marginLeft: "auto"}}>
              <div className="flex-row flex-center login-signup-wrapper" style={{marginRight: "16px"}}>
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
              { this.props.path !== '/getlisted' ? (
                <FlatButton
                  backgroundColor="#00c853"
                  hoverColor="#43a047"
                  rippleColor="#B2DFDB"
                  label="GET LISTED TODAY"
                  style={startListButtonStyle}
                  onClick={() => {
                    this.routerPush('/getlisted')
                  }}
                  />
              ) : null}

            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    path: state.routing.locationBeforeTransitions.pathname,
    auth: state.auth,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(AuthActions, dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(Navbar);
