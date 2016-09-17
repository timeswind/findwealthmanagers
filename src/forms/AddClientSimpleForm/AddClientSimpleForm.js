import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';

const validate = values => {
  const errors = {}
  const requiredFields = [ 'name' ]
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

class AddClientSimpleForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit} className="flex-column">

        <div className="flex-column">
          <Field
            name="name"
            fullWidth={true}
            component={TextField}
            hintText="Name"
            />
          <Field
            name="email"
            fullWidth={true}
            component={TextField}
            hintText="Email"
            />
          <Field
            name="phone"
            fullWidth={true}
            component={TextField}
            hintText="Phone"
            />
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
AddClientSimpleForm = reduxForm({
  form: 'addClientSimpleForm', // a unique name for this form
  validate
})(AddClientSimpleForm);

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}

export default connect(null, mapDispatchToProps)(AddClientSimpleForm);
