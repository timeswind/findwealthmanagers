import React, { Component } from 'react';
import { Field, FieldArray, reduxForm, change, reset } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import AutoComplete from 'material-ui/AutoComplete';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import CategorySelector from '../../components/CategorySelector/CategorySelector';

const validate = values => {
  const errors = {}
  const requiredFields = [ 'name', 'phone', 'brief', 'categories' ]
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

class NewPublicAdvisorForm extends Component {
  constructor(props) {
    super(props);
    var selectCategories = []
    if (props.initialValues && props.initialValues.categories) {
      selectCategories = props.initialValues.categories
    }
    this.state = {
      addressPredictions: [],
      selectCategories: selectCategories
    };
    this.AddressAutoCompleteService = null
    this.geocoder = null
    this.searchAddressDebounceTimeout = null
    this.initGoolePlaceAutocomplete()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValues && nextProps.initialValues.categories) {
      this.setState({ selectCategories: nextProps.initialValues.categories });
    } else {
      this.setState({ selectCategories: [] });
    }
  }

  selectAddress = (chosenAddress, index) => {
    var self = this

    self.props.dispatch(change('newPublicAdvisor', 'address', chosenAddress))
    this.geocoder.geocode( { 'address': chosenAddress}, function(results, status) {

      if (status === window.google.maps.GeocoderStatus.OK) {
        let longitude = results[0].geometry.location.lng()
        let latitude = results[0].geometry.location.lat()
        let loc = [longitude, latitude] //getjson format [ lng, lat ]
        self.props.dispatch(change('newPublicAdvisor', 'loc', loc))
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  handleAddressUpdateInput = (address) => {
    if (address) {
      let self = this
      window.clearTimeout(this.searchAddressDebounceTimeout)
      this.searchAddressDebounceTimeout = window.setTimeout(function () {
        self.searchAddress(address)
      }, 500);
    } else {
      window.clearTimeout(this.searchAddressDebounceTimeout)
    }
  };

  searchAddress = (address) => {
    let self = this
    this.AddressAutoCompleteService.getPlacePredictions({
      input: address,
      componentRestrictions: {country: 'us'}
    }, function (predictions) {
      var results = [];
      if (predictions) {
        predictions.forEach((prediction) => {
          results.push(prediction.description);
        })
      }
      self.setState({
        addressPredictions: results
      });
    });
  }

  initGoolePlaceAutocomplete() {
    this.AddressAutoCompleteService = new window.google.maps.places.AutocompleteService();
    this.geocoder = new window.google.maps.Geocoder();
  }

  onCategorySelect = (categories) => {
    const formattedCategories = categories.map((category) => {
      return category.code
    })
    if (this.props.initialValues) {
      this.props.initialValues.categories = formattedCategories
    }
    this.setState({selectCategories: formattedCategories})
    this.props.dispatch(change('newPublicAdvisor', 'categories', formattedCategories))
  }

  render() {
    const { initialValues } = this.props
    const { handleSubmit } = this.props
    const renderCategorySelector = ({ input, label, type, meta: { touched, error } }) => (
      <div>
        <CategorySelector onSelect={this.onCategorySelect} initialValues={this.state.selectCategories}></CategorySelector>
        {touched && ((error && <span style={{color: "rgb(244, 67, 54)", fontSize: 12}}>{error}</span>))}
      </div>
    )
    const renderExperience = ({ fields }) => (
      <div className="flex-column">
        <span className="field-title">
          Experience
        </span>
        {fields.map((experience, index) =>
          <div className="flex-column" key={index} style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "0 16px 16px 16px"}}>
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
    return (
      <form onSubmit={handleSubmit} className="flex-column">
        <Field name="name" component={TextField} hintText="Name" floatingLabelText="Name"/>
        <Field name="phone" component={TextField} hintText="Phone" floatingLabelText="Phone"/>
        <Field name="email" component={TextField} hintText="Email for bussiness" floatingLabelText="Email for bussiness"/>
        <Field name="affiliation" component={TextField} hintText="Affiliation" floatingLabelText="Affiliation"/>
        <Field name="categories"component={renderCategorySelector}/>
        <Field
          name="brief"
          multiLine={true}
          fullWidth={true}
          rows={3}
          component={TextField}
          hintText="Brief"
          floatingLabelText="Brief"
          />
        <Field name="room" component={TextField} hintText="Room" floatingLabelText="Room"/>
        <AutoComplete
          hintText="Address"
          floatingLabelText="Address"
          openOnFocus={true}
          fullWidth={true}
          filter={(address)=> {
            return address
          }}
          searchText={initialValues.address || ""}
          dataSource={this.state.addressPredictions}
          onUpdateInput={this.handleAddressUpdateInput}
          onNewRequest={this.selectAddress}
          />
        <FieldArray name="experience" component={renderExperience}/>
        <div className="flex-row justify-right">

          <FlatButton
            label="cancle"
            style={{marginTop: "16px", marginLeft: "16px"}}
            onClick={()=>{
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
            onClick={()=>{
              this.props.dispatch(reset('newPublicAdvisor'))
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
NewPublicAdvisorForm = reduxForm({
  form: 'newPublicAdvisor', // a unique name for this form
  validate
})(NewPublicAdvisorForm);

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}

export default connect(null, mapDispatchToProps)(NewPublicAdvisorForm);
