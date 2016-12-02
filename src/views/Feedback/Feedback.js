import React, { Component } from 'react';
import axios from 'axios';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import * as AuthActions from '../../../redux/actions/auth.js';
// import { push } from 'react-router-redux'
import './Feedback.css'
import AnswerFeedbackForm from '../../forms/AnswerFeedbackForm/AnswerFeedbackForm';

class FeedbackView extends Component {
  state = {
    template: null,
    submit: false
  }
  componentWillMount() {
    let self = this
    axios.get('/api/public/feedback/' + this.props.routeParams.id)
    .then(function(response) {
      if (response.data.success && response.data.feedbackTemplate) {
        self.setState({template: response.data.feedbackTemplate})
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleFeedbackSubmit = (form) => {
    let self = this

    if (this.props.auth.email) {
        form['email'] = this.props.auth.email
    }
    console.log(form)
    axios.post('/api/public/feedback/' + this.props.routeParams.id, form)
    .then(function(response) {
      if (response.data.success) {
        self.setState({submit: true})
      } else {
        // handle error
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  render() {
    return (
      <div className="view-body">
        <div className="feedback-form-wrapper light-card">
          {(this.state.template !== null && this.state.submit === false) && (<AnswerFeedbackForm onSubmit={this.handleFeedbackSubmit} template={this.state.template}></AnswerFeedbackForm>)}
          {(this.state.submit === true) && (
            <div>
              Your response has been recorded.
            </div>
          )}
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
