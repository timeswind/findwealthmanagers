import React, { Component } from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { TextField, DatePicker, Checkbox } from 'redux-form-material-ui';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { connect } from 'react-redux';
import AddressAutoComplete from '../../../components/AddressAutoComplete/AddressAutoComplete';

const renderAddressInput = field => (
  <AddressAutoComplete
    currentValue={field.input.value}
    onAddressInput={(address) => {field.input.onChange(address)}}
    onAddressSelect={(address, loc) => {field.input.onChange(address)}}
    underlineShow={true}
    hintText="Address"
    floatingLabelText="Address" />
)
const renderFields = ({ fields, fieldsValue }) => {
  return (
    <div className="flex-column" style={{display: 'inline-block'}}>
      {fields.map((field, index) => {
        return (
          <div className="flex-column" key={index}>
            <div className="flex-row flex-baseline">
              <Field
                floatingLabelText={(!!fieldsValue && fieldsValue[index]) ? fieldsValue[index].key : 'Field Name'}
                hintText="Field Name"
                name={`${field}.key`}
                type="text"
                component={TextField}
                style={{marginRight: 16}}
                />
              <Field
                floatingLabelText={(!!fieldsValue && fieldsValue[index]) ? fieldsValue[index].value : 'Field Value'}
                hintText="Value"
                name={`${field}.value`}
                type="text"
                component={TextField}
                style={{marginRight: 16}}
                />
              <IconButton tooltip="Remove" style={{marginTop: 8}} iconStyle={{color: "#F44336"}} onTouchTap={() => fields.remove(index)}>
                <FontIcon className="material-icons" style={{color: "#F44336"}}>delete</FontIcon>
              </IconButton>
            </div>
          </div>
        )
      }
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
)
}

class AgentDetailView extends Component {
  shouldComponentUpdate(nextProps) {
    return (nextProps.id !== this.props.id || nextProps.dirty !== this.props.dirty)
  }

  render() {
    const { id, style, fields, dirty, reset, handleSubmit, onDelete } = this.props

    return (
      <form className="flex-column" style={style} onSubmit={handleSubmit}>
        { dirty && (
          <div className="flex-row" style={{marginBottom: 8}}>
            <FlatButton
              label="Update Client"
              backgroundColor="rgb(48, 73, 102)"
              hoverColor="rgba(48, 73, 102, 0.8)"
              style={{color: '#fff', marginRight: 8}}
              type="submit"
              />
            <FlatButton
              label="Cancel"
              style={{color: 'rgb(48, 73, 102)', marginRight: 8}}
              onTouchTap={()=>{
                reset()
              }}
              />
          </div>
        ) }
        <div className="flex-row">
          <div className="flex-column light-card default-padding" style={{flex: 50, marginRight: 8}}>
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
              format={(value, name) => {
                return (value === '' || typeof value === "undefined") ? null : new Date(value)
              }}
              hintText="Join At"
              floatingLabelText="Join At"
              />
            <Field name="address" component={renderAddressInput}/>
            <Field name="isActive"
              component={Checkbox}
              label="Active"
              style={{marginBottom: 24, marginTop: 16}}/>
            <FieldArray name="fields" props={{fieldsValue: fields}} component={renderFields}/>
          </div>
          <div className="flex-column light-card" style={{flex: 50, padding: "0 16px 16px 16px"}}>
            <Field
              name="note"
              component={TextField}
              multiLine={true}
              fullWidth={true}
              rows={3}
              hintText="Note"
              floatingLabelText="Note"
              />
          </div>
        </div>
        <div className="flex-row" style={{marginTop: 16}}>
          { dirty && (
            <div className="flex-row" style={{marginBottom: 8}}>
              <FlatButton
                label="Update Client"
                backgroundColor="rgb(48, 73, 102)"
                hoverColor="rgba(48, 73, 102, 0.8)"
                style={{color: '#fff', marginRight: 8}}
                type="submit"
                />
              <FlatButton
                label="Cancel"
                style={{color: 'rgb(48, 73, 102)', marginRight: 8}}
                onTouchTap={()=>{
                  reset()
                }}
                />
            </div>
          ) }
          <FlatButton
            label="Delete Agent"
            style={{color: 'rgb(244, 67, 54)'}}
            backgroundColor="rgba(153, 153, 153, 0.1)"
            onTouchTap={()=>{
              onDelete(id)
            }}
            />
        </div>
      </form>
    )
  }
}
const selector = formValueSelector('agentEditForm')
AgentDetailView = reduxForm({
  form: 'agentEditForm',
  enableReinitialize: true
})(AgentDetailView);

AgentDetailView = connect(
  state => {
    const fields = selector(state, 'fields')
    const id = selector(state, '_id')
    return {
      fields,
      id
    }
  },
  dispatch => {
    return {
      dispatch
    }
  }
)(AgentDetailView)

export default AgentDetailView;
