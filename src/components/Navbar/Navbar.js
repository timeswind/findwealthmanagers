import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import withRouter from 'react-router/lib/withRouter'

const startListButtonStyle = {
  color: "#FFFFFF"
};

const titleStyle = {
  fontSize: "26px",
  fontFamily: "Raleway",
  fontWeight: 600,
  color: "rgb(48, 73, 102)"
}

class Navbar extends Component {
  routerPush (path) {
    this.props.router.push(path)
  }

  render() {

    return (
      <div className="navbar-wrapper">
        <div className="navbar flex-row flex-center">
          <a style={titleStyle}
            onClick={() => {
              this.routerPush('/')
            }}>
            FIND WEALTH MANAGERS</a>
          <FlatButton
            label="Sign In"
            hoverColor="transparent"
            style={{color: "#448aff", marginLeft:"auto"}}
            />
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
    );
  }
}

export default withRouter(Navbar);
