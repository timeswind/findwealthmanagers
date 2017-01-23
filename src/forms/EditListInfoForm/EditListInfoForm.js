import React, {Component} from 'react';
import {Field, FieldArray, reduxForm, change, formValueSelector, reset} from 'redux-form';
import {TextField} from 'redux-form-material-ui';
import AddressAutoComplete from '../../components/AddressAutoComplete/AddressAutoComplete';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import CategorySelector from '../../components/CategorySelector/CategorySelector';

const validate = values => {
  const errors = {}
  const requiredFields = ['brief', 'name']
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })

  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  return errors
}

class EditListInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectCategories: props.initialValues.categories
    };
  }

  onCategorySelect = (categories) => {
    const formattedCategories = categories.map((category) => {
      return category.code
    })
    this.props.initialValues.categories = formattedCategories
    this.setState({selectCategories: formattedCategories})
    this.props.dispatch(change('editListInfo', 'categories', formattedCategories))
  }

  onAddressSelect = (address, loc, address_index) => {
    const {dispatch} = this.props
    dispatch(change('editListInfo', `addresses[${address_index}].formattedAddress`, address))
    dispatch(change('editListInfo', `addresses[${address_index}].loc`, loc))
  }

  render() {
    const {addressesValue} = this.props
    const renderAddresses = ({fields}) => (
        <div className="flex-column" style={{marginBottom: 16}}>
          <span className="field-title">Addresses</span>
          {fields.map((address, index) =>
              <div className="flex-row flex-center" key={index}
                   style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "0 16px 16px 16px"}}>
                <AddressAutoComplete
                    initialValue={addressesValue && addressesValue[index]}
                    hintText="Address"
                    floatingLabelText="Address"
                    openOnFocus={true}
                    fullWidth={true}
                    onAddressSelect={(address, loc) => {
                      this.onAddressSelect(address, loc, index)
                    }}
                    style={{display: "flex", flex: 1}}
                />
                <div className="flex-row justify-right">
                  <FlatButton
                      label="Remove"
                      labelStyle={{color: "#FFF"}}
                      rippleColor="#B2DFDB"
                      backgroundColor="#F44336"
                      hoverColor="#E57373"
                      style={{marginTop: 16, marginLeft: 16}}
                      onClick={() => fields.remove(index)}/>
                </div>
              </div>
          )}
          <div className="flex-row">
            <FlatButton
                label="Add Address"
                labelStyle={{color: "#FFF"}}
                rippleColor="#B2DFDB"
                backgroundColor="#546E7A"
                hoverColor="#37474F"
                style={{marginTop: "16px"}}
                onClick={() => fields.push()}/>
          </div>
        </div>
    )
    const renderPhones = ({fields}) => (
        <div className="flex-column">
        <span className="field-title">
          Phone Numbers
        </span>
          {fields.map((phone, index) =>
              <div className="flex-row flex-center" key={index}
                   style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "0 16px 16px 16px"}}>
                <Field
                    floatingLabelText="phone number"
                    hintText="phone number"
                    name={`${phone}`}
                    type="text"
                    component={TextField}
                    fullWidth={true}
                    label={`phone #${index + 1}`}/>
                <div className="flex-row justify-right">
                  <FlatButton
                      label="Remove"
                      labelStyle={{color: "#FFF"}}
                      rippleColor="#B2DFDB"
                      backgroundColor="#F44336"
                      hoverColor="#E57373"
                      style={{marginTop: 16, marginLeft: 16}}
                      onClick={() => fields.remove(index)}/>
                </div>
              </div>
          )}
          <div className="flex-row">
            <FlatButton
                label="Add phone number"
                labelStyle={{color: "#FFF"}}
                rippleColor="#B2DFDB"
                backgroundColor="#546E7A"
                hoverColor="#37474F"
                style={{marginTop: "16px"}}
                onClick={() => fields.push()}/>
          </div>
        </div>
    )
    const renderExperience = ({fields}) => (
        <div className="flex-column">
        <span className="field-title">
          Experience
        </span>
          {fields.map((experience, index) =>
              <div className="flex-column" key={index}
                   style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "0 16px 16px 16px"}}>
                <Field
                    floatingLabelText="Title"
                    hintText="Title"
                    name={`${experience}.title`}
                    type="text"
                    component={TextField}
                    fullWidth={true}
                    label={`Title #${index + 1}`}/>
                <Field
                    floatingLabelText="Content"
                    hintText="Content"
                    name={`${experience}.text`}
                    type="text"
                    component={TextField}
                    multiLine={true}
                    fullWidth={true}
                    rows={3}
                    label={`Text #${index + 1}`}/>
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
                label="Add experience"
                labelStyle={{color: "#FFF"}}
                rippleColor="#B2DFDB"
                backgroundColor="#546E7A"
                hoverColor="#37474F"
                style={{marginTop: "16px"}}
                onClick={() => fields.push()}/>
          </div>
        </div>
    )
    const {handleSubmit} = this.props;
    return (
        <form onSubmit={handleSubmit} className="flex-column">
          <Field
              name="name"
              fullWidth={true}
              component={TextField}
              hintText="Name"
              floatingLabelText="Name"
              style={{marginBottom: 16}}
          />
          <FieldArray name="phones" component={renderPhones}/>
          <CategorySelector onSelect={this.onCategorySelect}
                            initialValues={this.state.selectCategories}></CategorySelector>
          <Field
              name="brief"
              multiLine={true}
              fullWidth={true}
              rows={3}
              component={TextField}
              hintText="Brief"
              floatingLabelText="Brief"
          />
          <FieldArray name="addresses" component={renderAddresses}/>
          <FieldArray name="experience" component={renderExperience}/>
          <div className="flex-row justify-right">

            <FlatButton
                label="cancle"
                style={{marginTop: "16px", marginLeft: "16px"}}
                onClick={() => {
                  this.props.handleCancle()
                }}
            />
            <FlatButton
                label="RESET"
                labelStyle={{color: "#FFF"}}
                rippleColor="#B2DFDB"
                backgroundColor="#FFC107"
                hoverColor="#F57C00"
                style={{marginTop: "16px", marginLeft: "16px"}}
                onClick={() => {
                  this.props.dispatch(reset('editListInfo'))
                }}
            />
            <FlatButton
                label="submit"
                type="submit"
                labelStyle={{color: "#FFF"}}
                rippleColor="#B2DFDB"
                backgroundColor="#2196F3"
                hoverColor="#64B5F6"
                style={{marginTop: "16px", marginLeft: "16px"}}
            />
          </div>

        </form>
    );
  }
}

// Decorate the form component
EditListInfoForm = reduxForm({
  form: 'editListInfo', // a unique name for this form
  validate
})(EditListInfoForm);

const selector = formValueSelector('editListInfo')
EditListInfoForm = connect(
    state => {
      // can select values individually
      const addressesValue = selector(state, 'addresses')
      return {
        addressesValue,
      }
    },
    dispatch => {
      return {
        dispatch
      }
    }
)(EditListInfoForm)


export default EditListInfoForm;
