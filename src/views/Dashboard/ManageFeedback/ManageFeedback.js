import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import fetch from '../../../core/fetch/fetch';
// import { bindActionCreators } from 'redux';
import { List, ListItem } from 'material-ui/List';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
// import * as AuthActions from '../../../redux/actions/auth.js';
// import { push } from 'react-router-redux'
import './ManageFeedback.css'
import NewFeedbackForm from '../../../forms/NewFeedbackForm/NewFeedbackForm';

class ManageFeedbackView extends Component {
  state = {
    createForm: false,
    templateIndex: null,
    templates: []
  }

  componentWillMount() {
    this.getTemplates()
  }

  showCreateForm() {
    this.setState({createForm: true})
  }

  showTemplate(template_index) {
    this.setState({
      createForm: false,
      templateIndex: template_index
    })
  }

  getTemplates() {
    var self = this
    fetch('/api/protect/feedback/templates', {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      }
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.success && json.templates && json.templates.length !== 0) {
        self.setState({templates: json.templates})
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleFeecbackTemplateFormSubmit = (form) => {
    fetch('/api/protect/feedback/template', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
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

  renderTemplate(template_index) {
    if (template_index !== null) {
      let title = this.state.templates[template_index].title
      let fields = this.state.templates[template_index].fields
      return (
        <div className="flex-column">
          <div className="feedback-preview-title">{title}</div>
          {
            fields.map((field, index)=>{
              return (
                <div key={field._id} className="flex-column">
                  <div className="feedback-preview-question">
                    <span>{index + 1}. </span>
                    {field.question}
                  </div>
                  <div>
                    { field.type === "response" && (
                      <TextField
                        hintText="Response"
                        multiLine={true}
                        rows={2}
                        fullWidth={true}
                        />
                    ) }
                    { field.type === "mc" && (
                      <RadioButtonGroup name={`choice${index}`}>
                        {
                          field.choices.map((choice, choice_index)=>{
                            return (
                              <RadioButton
                                value={choice}
                                label={choice}
                                key={choice_index}
                                />
                            )
                          })
                        }
                      </RadioButtonGroup>
                    ) }
                    { field.type === "rate" && (
                      <div className="flex-row feedback-rates-preview">
                        {
                          field.rates.map((rate, rate_index)=>{
                            return (
                              <div style={{flex: "1 1 auto"}} key={rate_index}><input type="radio" value={rate}/>{rate}</div>
                            )
                          })
                        }
                      </div>
                    ) }
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    }
  }

  render() {
    return (
      <div className="view-body flex-row" style={{minHeight: '100%'}}>
        <div className="feedback-form-list flex-column" style={{flex: 50}}>
          <div className="flex-column default-padding">
            <FlatButton label="Create new feedback form" backgroundColor="#eee" onTouchTap={()=>{
                this.showCreateForm()
              }}
              />
          </div>

          { this.state.templates.map((template, index)=>{
            return (
              <ListItem
                key={template._id}
                primaryText={template.title}
                secondaryText={`${template.fields.length} question`}
                onTouchTap={()=>{
                  this.showTemplate(index)
                }}
                rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
                />
            )
          }) }
        </div>
        { this.state.createForm ? (
          <div className="feedback-form-editor light-card">
            <NewFeedbackForm onSubmit={this.handleFeecbackTemplateFormSubmit}></NewFeedbackForm>
          </div>
        ) : (
          <div className="feedback-form-preview light-card">
            {this.renderTemplate(this.state.templateIndex)}
          </div>
        ) }
      </div>
    );
  }
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(ManageFeedbackView);
