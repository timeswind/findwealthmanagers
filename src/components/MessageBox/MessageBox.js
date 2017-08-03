import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ViewActions from '../../redux/actions/view';

import './MessageBox.css';

class MessageBox extends Component {
  componentDidMount () {

  }
  toggleMessageBox() {
    const {actions, messagebox} = this.props
    actions.setViewMessageboxStatus(!messagebox)
  }

  render() {
    const {messagebox} = this.props
    const meessageBoxClassName = messagebox ? "show" : "hide"
    return (
      <div id="message_box" className={meessageBoxClassName} ref="messagebox">
        <div className="box_header" onClick={()=>{this.toggleMessageBox()}}>
          <span className="header-text">chat</span>
          <FontIcon className="material-icons hide-button" color="#ffffff">remove</FontIcon>
        </div>
        <div>
          this is a message box
        </div>
        <div>
        </div>
      </div>
    );
  }
}

MessageBox.defaultProps = {
  // height: "200px",
  // width: "100%",
  // zoom: 4
};

MessageBox.propTypes = {
  // height: PropTypes.string,
  // width: PropTypes.string,
  // zoom: PropTypes.number,
  // markerPosition: PropTypes.object
};

const mapStatesToProps = (states) => {
  return {
    messagebox: states.view.messagebox
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, ViewActions), dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(MessageBox);
