import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import fetch from '../../core/fetch/fetch';
// import { bindActionCreators } from 'redux';
import { List, ListItem } from 'material-ui/List';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
// import * as AuthActions from '../../../redux/actions/auth.js';
// import { push } from 'react-router-redux'
import './Feedback.css'
import AnswerFeedbackForm from '../../forms/AnswerFeedbackForm/AnswerFeedbackForm';

class FeedbackView extends Component {
  state = {
    template: null
  }
  componentWillMount() {
    let self = this
    fetch('/api/public/feedback/' + this.props.routeParams.id, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
      if (json.success) {
        self.setState({template: json.feedbackTemplate})
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleFeedbackSubmit = (form) => {
    if (this.props.auth.email) {
        form['email'] = this.props.auth.email
    }
    console.log(form)
    fetch('/api/public/feedback/' + this.props.routeParams.id, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  render() {
    return (
      <div className="view-body">
        <div className="feedback-form-wrapper light-card">
          {this.state.template !== null && (<AnswerFeedbackForm onSubmit={this.handleFeedbackSubmit} template={this.state.template}></AnswerFeedbackForm>)}
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth
  };
}

export default connect(mapStatesToProps, null)(FeedbackView);
