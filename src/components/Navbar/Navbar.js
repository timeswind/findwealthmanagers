import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import withRouter from 'react-router/lib/withRouter'

const startListButtonStyle = {
  color: "#FFFFFF"
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { windowWidth: window.innerWidth };
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
          <div className="flex-row" style={{marginLeft: "auto"}}>
            { this.state.windowWidth < 1000 ? null : (
              <div className="flex-row flex-center" style={{marginRight: "16px"}}>

                <FlatButton
                  label="Log In"
                  hoverColor="transparent"
                  style={{color: "#448aff"}}
                  />
                <FlatButton
                  label="Sign up"
                  hoverColor="transparent"
                  style={{color: "#448aff"}}
                  />
              </div>

            )}
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
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Navbar);
