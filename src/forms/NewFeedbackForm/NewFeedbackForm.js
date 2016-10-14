import React, { Component } from 'react';
import { Field, FieldArray, reduxForm, formValueSelector, change, reset } from 'redux-form';
import { TextField, SelectField } from 'redux-form-material-ui';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';

const renderFields = ({ fields, fieldsValue }) =>
  <div className="flex-column">
    {fields.map((field, index) =>
      <div className="flex-column" key={index} style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "0 16px 16px 16px"}}>
        <Field
          floatingLabelText="Question"
          hintText="Question"
          name={`${field}.question`}
          type="text"
          component={TextField}
          fullWidth={true}
          label={`Question #${index + 1}`}/>
        <Field
          name={`${field}.type`}
          component={SelectField}
          hintText="Question type"
          floatingLabelText="Question type">
          <MenuItem value="response" primaryText="Response"/>
          <MenuItem value="mc" primaryText="Multiple Choice"/>
        </Field>
        { fieldsValue[index] && fieldsValue[index]['type'] && fieldsValue[index]['type'] === 'mc' ? (<FieldArray name={`${field}.choices`} component={renderHobbies}/>) : null }
        <div className="flex-row justify-right">
          <FlatButton
            label="Remove"
            labelStyle={{color: "#FFF"}}
            rippleColor="#B2DFDB"
            backgroundColor="#F44336"
            hoverColor="#E57373"
            style={{marginTop: "16px"}}
            onClick={() => fields.remove(index)}/>
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
        style={{marginTop: "16px"}}
        onClick={() => fields.push()}/>
    </div>
  </div>

  const renderHobbies = ({ fields }) =>
    <div className="flex-column">
      {fields.map((field, index) =>
        <div className="flex-column" key={index} style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "0 16px 16px 16px"}}>
          <Field
            floatingLabelText="Choice"
            hintText="Choice"
            name={`${field}.choice`}
            type="text"
            component={TextField}
            fullWidth={true}
            label={`Choice #${index + 1}`}
            />
          <div className="flex-row justify-right">
            <FlatButton
              label="Remove"
              labelStyle={{color: "#FFF"}}
              rippleColor="#B2DFDB"
              backgroundColor="#F44336"
              hoverColor="#E57373"
              style={{marginTop: "16px"}}
              onClick={() => fields.remove(index)}/>
          </div>
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
          onClick={() => fields.push()}/>
      </div>
    </div>


class NewFeedbackForm extends Component {
  render() {
    const { handleSubmit, fieldsValue } = this.props;

    return (
      <form onSubmit={handleSubmit} className="flex-column">

        <div className="flex-column">
          <Field
            name="title"
            fullWidth={true}
            component={TextField}
            hintText="Feedback Title"
            />
          <FieldArray name="fields" props={{fieldsValue: fieldsValue}} component={renderFields}/>

          <FlatButton
            type="submit"
            label="add"
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
  form: 'newFeedbackForm' // a unique name for this form
})(NewFeedbackForm);

const selector = formValueSelector('newFeedbackForm') // <-- same as form name
NewFeedbackForm = connect(
  state => {
    // can select values individually
    const fieldsValue = selector(state, 'fields')
    return {
      fieldsValue,
    }
  }
)(NewFeedbackForm)

export default NewFeedbackForm;
