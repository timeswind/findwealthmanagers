import React, { Component } from 'react';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { TextField, RadioButtonGroup, Checkbox } from 'redux-form-material-ui';
import { RadioButton } from 'material-ui/RadioButton'
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { connect } from 'react-redux';
import AddressAutoComplete from '../../../components/AddressAutoComplete/AddressAutoComplete';
import CategorySelector from '../../../components/CategorySelector/CategorySelector';
import ClientbookAppointments from '../../../components/ClientbookAppointments/ClientbookAppointments';

const renderCategoriesSelector = field => (
  <CategorySelector
    initialValues={field.input.value}
    onSelect={(categories)=>{
      let categoriesCodes = categories.map((category) => category.code)
      field.input.onChange(categoriesCodes)
    }}
    />
)

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

class ClientDetailView extends Component {
  shouldComponentUpdate(nextProps) {
    return (nextProps.id !== this.props.id || nextProps.dirty !== this.props.dirty || nextProps.appointments !== this.props.appointments)
  }

  render() {
    const { id, appointments, style, fields, dirty, reset, handleSubmit, onDelete, initialValues } = this.props

    return (
      <form className="flex-column" style={style} onSubmit={handleSubmit}>
        { dirty && (
          <div className="flex-row" style={{marginBottom: 8}}>
            <FlatButton
              label="Update Client Information"
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
              hintText="Client Name"
              floatingLabelText="Client Name"
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
            <Field name="categories" component={renderCategoriesSelector}/>
            <Field name="gender" component={RadioButtonGroup} className="flex-row">
              <RadioButton value="1" label="Male"
                style={{width: 80, marginRight: 16}}/>
              <RadioButton value="2" label="Female"
                style={{width: 80, marginRight: 16}}/>
            </Field>
            <div style={{border: '1px solid #ddd', padding: '0 16px', margin: '16px 0'}}>
              <div className="flex-row flex-baseline" style={{marginTop: 16}}>
                <span style={{marginRight: 8, fontSize: 18, fontWeight: 'Bold', fontFamily: 'raleway'}}>Profile</span>
                <span style={{fontSize: 18, fontWeight: 'Bold', fontFamily: 'raleway', backgroundColor: '#FF9800', color: '#fff', padding: 4, borderRadius: 3}}>{initialValues.profile && 'Rating: ' + Object.keys(initialValues.profile).filter(function(key) { return initialValues.profile[key] === true}).length}</span>
              </div>
              <div className="flex-row">
                <div style={{marginRight: 16}}>
                  <Field name="profile.married"
                    component={Checkbox}
                    label="Married"
                    style={{marginBottom: 24, marginTop: 16}}/>
                  <Field name="profile.income"
                    component={Checkbox}
                    label="Income"
                    style={{marginBottom: 24, marginTop: 16}}/>
                  <Field name="profile.homeowner"
                    component={Checkbox}
                    label="Homeowner"
                    style={{marginBottom: 24, marginTop: 16}}/>
                </div>
                <div>
                  <Field name="profile.ambitious"
                    component={Checkbox}
                    label="Ambitious"
                    style={{marginBottom: 24, marginTop: 16}}/>
                  <Field name="profile.dissatisfied"
                    component={Checkbox}
                    label="Dissatisfied"
                    style={{marginBottom: 24, marginTop: 16}}/>
                  <Field name="profile.coachable"
                    component={Checkbox}
                    label="Coachable"
                    style={{marginBottom: 24, marginTop: 16}}/>
                </div>
              </div>
            </div>
            <Field
              name="age"
              component={TextField}
              hintText="Age"
              floatingLabelText="Age"
              />
            <Field
              name="job"
              component={TextField}
              hintText="Job"
              floatingLabelText="Job"
              />
            <Field
              name="income"
              component={TextField}
              hintText="Income"
              floatingLabelText="Income"
              />
            <Field name="address" component={renderAddressInput}/>
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
            <ClientbookAppointments appointments={appointments}/>
          </div>
        </div>
        <div className="flex-row" style={{marginTop: 16}}>
          { dirty && (
            <div className="flex-row" style={{marginBottom: 8}}>
              <FlatButton
                label="Update Client Information"
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
            label="Delete Client"
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
const selector = formValueSelector('clientEditForm')
ClientDetailView = reduxForm({
  form: 'clientEditForm',
  enableReinitialize: true
})(ClientDetailView);

ClientDetailView = connect(
  state => {
    const fields = selector(state, 'fields')
    const id = selector(state, '_id')
    const appointments = selector(state, 'appointments')
    return {
      fields,
      id,
      appointments
    }
  },
  dispatch => {
    return {
      dispatch
    }
  }
)(ClientDetailView)

export default ClientDetailView;
