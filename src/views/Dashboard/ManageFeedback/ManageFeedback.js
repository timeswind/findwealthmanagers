import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import fetch from '../../../core/fetch/fetch';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthActions from '../../../redux/actions/auth.js';
import { push } from 'react-router-redux'
import './ManageFeedback.css'
import NewFeedbackForm from '../../../forms/NewFeedbackForm/NewFeedbackForm';

class ManageFeedbackView extends Component {
  state = {
    createForm: false
  }

  showCreateForm() {
    this.setState({createForm: true})
  }

  render() {
    return (
      <div className="view-body flex-row" style={{minHeight: '100%'}}>
        <div className="feedback-form-list flex-column" style={{flex: 40}}>
          <FlatButton label="Create new feedback form" backgroundColor="#eee" onTouchTap={()=>{
              this.showCreateForm()
            }}/>
        </div>
        { this.state.createForm ? (
          <div className="feedback-form-editor light-card" style={{flex: 60}}>
            <NewFeedbackForm></NewFeedbackForm>
          </div>
        ) : null }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}

export default connect(null, mapDispatchToProps)(ManageFeedbackView);
