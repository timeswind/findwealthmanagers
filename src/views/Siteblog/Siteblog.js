import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import fetch from '../../core/fetch/fetch';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthActions from '../../redux/actions/auth.js';
import { push } from 'react-router-redux'

class SiteblogView extends Component {

  render() {
    return (
      <div className="view-body">

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(AuthActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(SiteblogView);
