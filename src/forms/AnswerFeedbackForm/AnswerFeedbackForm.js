import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField, RadioButtonGroup } from 'redux-form-material-ui';
import { RadioButton } from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';

class AnswerFeedbackForm extends Component {
  render() {
    const { handleSubmit, template } = this.props;
    let title = template.title
    let fields = template.fields
    return (
      <form onSubmit={handleSubmit} className="flex-column">
        {
          <div className="flex-column">
            <div className="feedback-preview-title">{title}</div>
            {
              fields.map((field, index)=>{
                return (
                  <div key={field._id} className="flex-column feedback-preview-question-wrapper">
                    <div className="feedback-preview-question">
                      {field.question}
                    </div>
                    <div>
                      { field.type === "response" && (
                        <Field
                          name={field._id}
                          component={TextField}
                          hintText="Response"
                          multiLine={true}
                          rows={1}
                          fullWidth={true}
                          />
                      ) }
                      { field.type === "mc" && (
                        <Field name={field._id} component={RadioButtonGroup}>
                          {
                            field.choices.map((choice, choice_index)=>{
                              return (
                                <RadioButton
                                  value={choice}
                                  label={choice}
                                  key={choice_index}
                                  style={{margin: "8px 0"}}
                                  />
                              )
                            })
                          }
                        </Field>
                      ) }
                      { field.type === "rate" && (
                        <div className="flex-row feedback-rates-preview">
                          {
                            field.rates.map((rate, rate_index)=>{
                              return (
                                <div className="flex-column align-center flex-auto-with" key={rate}>
                                  <div>{rate}</div>
                                  <Field name={field._id} component="input" type="radio" value={rate.toString()}/>
                                </div>
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
            <div className="flex-column" style={{padding: "0 16px"}}>
              { (!this.props.auth.email) && (
                <div className="flex-column">
                  <Field
                    name="email"
                    component={TextField}
                    hintText="Email"
                    />
                  <Field
                    name="name"
                    component={TextField}
                    hintText="Name"
                    />
                </div>
              ) }
              <div className="flex-row">
                <FlatButton
                  type="submit"
                  label="Submit"
                  style={{marginTop: '8px', color: '#fff'}}
                  backgroundColor="#4285f4"
                  />
              </div>
            </div>
          </div>
        }
      </form>
    );
  }
}

// Decorate the form component
AnswerFeedbackForm = reduxForm({
  form: 'answerFeedbackForm', // a unique name for this form
})(AnswerFeedbackForm);

AnswerFeedbackForm = connect(
  state => {
    return {
      auth: state.auth
    };
  },
  null
)(AnswerFeedbackForm)

export default AnswerFeedbackForm;
