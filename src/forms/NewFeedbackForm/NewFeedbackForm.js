import React, { Component } from 'react';
import { Field, FieldArray, reduxForm, formValueSelector, change } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { connect } from 'react-redux';
import _ from 'lodash';

const validate = values => {
  const errors = {}
  if (!values['title']) {
    errors[ 'title' ] = 'Required'
  } else if (values['fields']) {
    const fieldsArrayErrors = []
    values.fields.forEach((field, fieldIndex) => {
      const fieldsErrors = {}
      if (!field || !field.question) {
        fieldsErrors.question = 'Required'
      }
      if (!field || !field.type) {
        fieldsErrors.type = 'Select response type'
      }
      fieldsArrayErrors[fieldIndex] = fieldsErrors
      // if (member && member.hobbies && member.hobbies.length) {
      //   const hobbyArrayErrors = []
      //   member.hobbies.forEach((hobby, hobbyIndex) => {
      //     if (!hobby || !hobby.length) {
      //       hobbyArrayErrors[hobbyIndex] =  'Required'
      //     }
      //   })
      //   if(hobbyArrayErrors.length) {
      //     memberErrors.hobbies = hobbyArrayErrors
      //     membersArrayErrors[memberIndex] = memberErrors
      //   }
      //   if (member.hobbies.length > 5) {
      //     if(!memberErrors.hobbies) {
      //       memberErrors.hobbies = []
      //     }
      //     memberErrors.hobbies._error = 'No more than five hobbies allowed'
      //     membersArrayErrors[memberIndex] = memberErrors
      //   }
      // }

      return fieldsErrors
    })
    if(fieldsArrayErrors.length) {
      errors.fields = fieldsArrayErrors
    }
  }
  return errors
}

const changeRates = (min, max, question_index, dispatch) => {
  var rates = []
  for (var i = min; i <= max; i++) {
    rates.push(i)
  }
  dispatch(change('newFeedbackForm', `fields[${question_index}].rates`, rates))
}

const changeMinRate = (e, question_index, dispatch, fieldsValue) => {
  let minRate = window.parseInt(e.target.value)
  dispatch(change('newFeedbackForm', `fields[${question_index}].min`, minRate))
  if(_.has(fieldsValue[question_index], 'max') && _.isNumber(fieldsValue[question_index]['max'])) {
    changeRates(minRate, fieldsValue[question_index]['max'], question_index, dispatch)
  }
}

const changeMaxRate = (e, question_index, dispatch, fieldsValue) => {
  let maxRate = window.parseInt(e.target.value)
  dispatch(change('newFeedbackForm', `fields[${question_index}].max`, maxRate))
  if(_.has(fieldsValue[question_index], 'min') && _.isNumber(fieldsValue[question_index]['min'])) {
    changeRates(fieldsValue[question_index]['min'], maxRate, question_index, dispatch)
  }
}

const handleQuestionTypeChange = (e, key, payload, fieldsValue, question_index, dispatch) => {
  var newQuestion = {
    type: payload
  }
  if (fieldsValue[question_index] && fieldsValue[question_index].question) {
    newQuestion.question = fieldsValue[question_index].question
  }
  dispatch(change('newFeedbackForm', `fields[${question_index}]`, newQuestion))
}


const renderChoices = ({ fields }) =>
<div className="flex-column">
  {fields.map((field, index) =>
    <div className="flex-row flex-baseline" key={index} style={{margin: "8px 0 8px 0", border: "1px solid #ddd", padding: "0 16px 16px 16px"}}>
      <Field
        floatingLabelText={`Choice #${index + 1}`}
        hintText={`Choice #${index + 1}`}
        name={`${field}`}
        type="text"
        component={TextField}
        fullWidth={true}
        label={`Choice #${index + 1}`}
        style={{marginRight: 16}}/>

      <IconButton
        iconClassName="material-icons"
        iconStyle={{color: "#F44336"}}
        onTouchTap={() => fields.remove(index)}>delete</IconButton>
    </div>
  )}
  <div className="flex-row">
    <FlatButton
      label="Add Choice"
      labelStyle={{color: "#FFF"}}
      rippleColor="#B2DFDB"
      backgroundColor="#546E7A"
      hoverColor="#37474F"
      style={{marginTop: "16px"}}
      onTouchTap={() => fields.push()}
      icon={<FontIcon className="material-icons" style={{color: "#fff"}}>add</FontIcon>}/>
  </div>
</div>

const renderFields = ({ fields, fieldsValue, dispatch }) =>
<div className="flex-column">
  {fields.map((field, index) =>
    <div className="flex-column" key={index} style={{margin: "8px 0 8px 0", border: "1px solid #ddd", padding: "0 16px 16px 16px"}}>
      <div className="flex-row">
        <Field
          floatingLabelText="Question"
          hintText="Question"
          name={`${field}.question`}
          type="text"
          component={TextField}
          fullWidth={true}
          label={`Question #${index + 1}`}
          style={{marginRight: 16}}
          />
        <SelectField
          hintText="Question type"
          floatingLabelText="Question type"
          errorText={(!fieldsValue[index] || !fieldsValue[index].type) && "Select response type"}
          value={(fieldsValue[index] && fieldsValue[index]['type']) || ""}
          onChange={(e, key, payload)=>{
            handleQuestionTypeChange(e, key, payload, fieldsValue, index, dispatch)
          }}>
          <MenuItem value="response" primaryText="Response" leftIcon={<FontIcon className="material-icons">subject</FontIcon>} />
          <MenuItem value="mc" primaryText="Multiple Choice" leftIcon={<FontIcon className="material-icons">radio_button_checked</FontIcon>} />
          <MenuItem value="rate" primaryText="Linear scale" leftIcon={<FontIcon className="material-icons">linear_scale</FontIcon>} />
        </SelectField>
      </div>
      { fieldsValue[index] && fieldsValue[index]['type'] && fieldsValue[index]['type'] === 'mc' ? (<FieldArray name={`${field}.choices`} component={renderChoices}/>) : null }
      { fieldsValue[index] && fieldsValue[index]['type'] && fieldsValue[index]['type'] === 'rate' ? (
        <div className="flex-column">
          <div className="flex-row feedback-rates-preview">
            { fieldsValue[index] && fieldsValue[index]['rates'] && fieldsValue[index]['rates'].map((rate) =>
              <div className="flex-column align-center flex-auto-with" key={rate}>
                <div>{rate}</div>
                <input type="radio" value={rate} disabled="true"/>
              </div>
            )}
          </div>
          <div>
            <TextField
              floatingLabelText='From(min)'
              hintText='From(min)'
              label='From(min)'
              style={{marginRight: 16}}
              onChange={(e)=>{
                changeMinRate(e, index, dispatch, fieldsValue)
              }}
              />
            <TextField
              floatingLabelText='To(max)'
              hintText='To(max)'
              label='To(max)'
              type="number"
              onChange={(e)=>{
                changeMaxRate(e, index, dispatch, fieldsValue)
              }}
              />
          </div>
        </div>
      ) : null }
      <div className="flex-row justify-right" style={{marginTop: 24}}>
        <FlatButton
          icon={<FontIcon className="material-icons" style={{color: "#fff"}}>delete</FontIcon>}
          labelStyle={{color: "#FFF"}}
          rippleColor="#B2DFDB"
          backgroundColor="#F44336"
          hoverColor="#E57373"
          onTouchTap={() => fields.remove(index)}/>
      </div>
    </div>
  )}
  <div className="flex-row">
    <FlatButton
      label="Add Question"
      labelStyle={{color: "#FFF"}}
      rippleColor="#B2DFDB"
      backgroundColor="#546E7A"
      hoverColor="#37474F"
      onTouchTap={() => fields.push()}
      icon={<FontIcon className="material-icons" style={{color: "#fff"}}>add</FontIcon>}/>
  </div>
</div>


class NewFeedbackForm extends Component {
  render() {
    const { handleSubmit, fieldsValue, dispatch } = this.props;

    return (
      <form onSubmit={handleSubmit} className="flex-column">
        <div className="flex-column">
          <Field
            name="title"
            fullWidth={true}
            component={TextField}
            hintText="Feedback Title"
            />
          <FieldArray name="fields" props={{fieldsValue: fieldsValue, dispatch: dispatch}} component={renderFields}/>
          <FlatButton
            type="submit"
            label="Create"
            style={{width: '100%', marginTop: '8px'}}
            backgroundColor="#ddd"
            />
        </div>
      </form>
    );
  }
}

// Decorate the form component
NewFeedbackForm = reduxForm({
  form: 'newFeedbackForm', // a unique name for this form
  validate
})(NewFeedbackForm);

const selector = formValueSelector('newFeedbackForm') // <-- same as form name
NewFeedbackForm = connect(
  state => {
    // can select values individually
    const fieldsValue = selector(state, 'fields')
    return {
      fieldsValue,
    }
  },
  dispatch => {
    return {
      dispatch
    }
  }
)(NewFeedbackForm)

export default NewFeedbackForm;
