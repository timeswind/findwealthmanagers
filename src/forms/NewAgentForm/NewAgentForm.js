import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { TextField, DatePicker, Checkbox } from 'redux-form-material-ui';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { connect } from 'react-redux';
import AddressAutoComplete from '../../components/AddressAutoComplete/AddressAutoComplete';
// const required = value => value == null ? 'Required' : undefined

const renderAddressInput = field => (
  <AddressAutoComplete
    onAddressInput={(address) => {field.input.onChange(address)}}
    onAddressSelect={(address, loc) => {field.input.onChange(address)}}
    underlineShow={true}
    hintText="Address"
    floatingLabelText="Address" />
)

const renderFields = ({ fields }) =>
<div className="flex-column" style={{display: 'inline-block'}}>
  {fields.map((field, index) =>
    <div className="flex-column" key={index} style={{margin: "0 0 16px 0", border: "1px solid #ddd", padding: "0 16px 16px 16px", display: 'inline-block'}}>
      <div className="flex-row flex-baseline">
        <Field
          floatingLabelText="Field Name"
          hintText="Field Name"
          name={`${field}.key`}
          type="text"
          component={TextField}
          style={{marginRight: 16}}
          />
        <Field
          floatingLabelText="Value"
          hintText="Value"
          name={`${field}.value`}
          type="text"
          component={TextField}
          style={{marginRight: 16}}
          />
        <FlatButton
          icon={<FontIcon className="material-icons" style={{color: "#fff"}}>clear</FontIcon>}
          labelStyle={{color: "#FFF"}}
          rippleColor="#B2DFDB"
          backgroundColor="#F44336"
          hoverColor="#E57373"
          onTouchTap={() => fields.remove(index)}
          style={{bottom: 4}}/>
      </div>
    </div>
  )}
  <div className="flex-row">
    <FlatButton
      label="Add Field"
      labelStyle={{color: "#FFF"}}
      rippleColor="#B2DFDB"
      backgroundColor="#546E7A"
      hoverColor="#37474F"
      onTouchTap={() => fields.push()}
      icon={<FontIcon className="material-icons" style={{color: "#fff"}}>add</FontIcon>}/>
  </div>
</div>


class NewAgentForm extends Component {
  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit} className="flex-column">
        <div className="flex-column">
          <Field
            name="name"
            component={TextField}
            hintText="Agent Name"
            floatingLabelText="Agent Name"
            />
          <Field
            name="email"
            component={TextField}
            hintText="Email"
            floatingLabelText="Email"
            />
          <Field
            name="phone"
            component={TextField}
            hintText="Phone Number"
            floatingLabelText="Phone Number"
            />
          <Field
            name="referBy"
            component={TextField}
            hintText="Refer By"
            floatingLabelText="Refer By"
            />
          <Field name="joinAt"
            component={DatePicker}
            format={null}
            onChange={(value) => {
              console.log('date changed ', value) // eslint-disable-line no-console
            }}
            hintText="Join At"
            floatingLabelText="Join At"
            />
          <Field name="address" component={renderAddressInput}/>

          <Field name="isActive"
            component={Checkbox}
            label="Active"
            style={{marginBottom: 24, marginTop: 16}}/>
          <FieldArray name="fields" component={renderFields}/>
          <Field
            name="note"
            component={TextField}
            multiLine={true}
            fullWidth={true}
            rows={3}
            hintText="Note"
            floatingLabelText="Note"
            />
          <FlatButton
            type="submit"
            label="Create"
            style={{width: '100%', marginTop: '24px'}}
            backgroundColor="#ddd"
            />
        </div>
      </form>
    );
  }
}

NewAgentForm = reduxForm({
  form: 'newAgentForm'
})(NewAgentForm);

// const selector = formValueSelector('newAgentForm')
NewAgentForm = connect(
  state => {
    // const fieldsValue = selector(state, 'fields')
    return {
      // fieldsValue,
    }
  },
  dispatch => {
    return {
      dispatch
    }
  }
)(NewAgentForm)

export default NewAgentForm;
