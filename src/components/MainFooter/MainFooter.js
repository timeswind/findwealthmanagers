import React, { Component } from 'react';
// import FlatButton from 'material-ui/FlatButton';

const MainFooterStyle = {
  padding: "72px 24px",
  boxSizing: "border-box",
  backgroundColor: "rgb(33, 33, 33)",
  textAlign: "center",
  color: "#fff"
}

class MainFooter extends Component {
  render() {
    return (
      <div className="main-footer" style={MainFooterStyle}>
        <p style={{fontSize: "13px"}}>Wealthie © 2017. All Rights Reserved.</p>
      </div>
    );
  }
}

export default MainFooter;
