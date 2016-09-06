import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import withRouter from 'react-router/lib/withRouter'
import * as AuthActions from '../../redux/actions/auth.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const startListButtonStyle = {
  color: "#FFFFFF"
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { windowWidth: window.innerWidth };
  }

  logout() {
    const { actions } = this.props;
    actions.logout()
  }

  routerPush (path) {
    this.props.router.push(path)
  }

  render() {

    return (
      <div className="navbar-wrapper">
        <div className="navbar flex-row flex-center">
          <a className="nav-brand-text"
            onClick={() => {
              this.routerPush('/')
            }}>
            FIND WEALTH MANAGERS</a>
          { this.props.auth.isLogin ? (
            <div className="flex-row flex-center" style={{marginLeft: "auto"}}>
              <span>{this.props.auth.name}</span>
              <FlatButton
                label="Log Out"
                hoverColor="transparent"
                style={{color: "#448aff"}}
                onClick={() => {
                  this.logout()
                }}/>
            </div>
          ) : (
          <div className="flex-row" style={{marginLeft: "auto"}}>
            { this.state.windowWidth < 1000 ? null : (
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

            )}
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
    actions: bindActionCreators(AuthActions, dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(withRouter(Navbar));
