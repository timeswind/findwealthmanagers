import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { TextField, RadioButtonGroup } from 'redux-form-material-ui';
import { RadioButton } from 'material-ui/RadioButton'

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
                      <span>{index + 1}. </span>
                      {field.question}
                    </div>
                    <div>
                      { field.type === "response" && (
                        <Field
                          name={field._id}
                          component={TextField}
                          hintText="Response"
                          multiLine={true}
                          rows={2}
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

// const selector = formValueSelector('newFeedbackForm') // <-- same as form name
// AnswerFeedbackForm = connect(
//   state => {
//     // can select values individually
//     const fieldsValue = selector(state, 'fields')
//     return {
//       fieldsValue,
//     }
//   },
//   dispatch => {
//     return {
//       dispatch
//     }
//   }
// )(AnswerFeedbackForm)

export default AnswerFeedbackForm;
