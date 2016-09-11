import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import FlatButton from 'material-ui/FlatButton';

const validate = values => {
  const errors = {}
  const requiredFields = [ 'phone', 'email', 'brief' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })

  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  return errors
}

class EditListInfoForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit} className="flex-column">
        <Field name="phone" component={TextField} hintText="Phone" floatingLabelText="Phone"/>
        <Field name="email" component={TextField} hintText="Email" floatingLabelText="Email"/>
        <Field name="brief" component={TextField} hintText="Brief" floatingLabelText="Brief"/>
        <Field name="address" component={TextField} hintText="Address" floatingLabelText="Address"/>

        <FlatButton type="submit">Submit</FlatButton>
      </form>
    );
  }
}

// Decorate the form component
EditListInfoForm = reduxForm({
  form: 'editListInfo', // a unique name for this form
  validate
})(EditListInfoForm);

export default EditListInfoForm;
