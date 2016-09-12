import React, { Component } from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import AutoComplete from 'material-ui/AutoComplete';
import { connect } from 'react-redux';
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
  constructor(props) {
    super(props);
    this.state = {
      addressPredictions: []
    };
    this.AddressAutoCompleteService = null
    this.geocoder = null
    this.searchAddressDebounceTimeout = null
    this.initGoolePlaceAutocomplete()
  }

  selectAddress = (chosenAddress, index) => {
    var self = this

    self.props.dispatch(change('editListInfo', 'address', chosenAddress))
    console.log('select address')
    this.geocoder.geocode( { 'address': chosenAddress}, function(results, status) {

      if (status === window.google.maps.GeocoderStatus.OK) {
        console.log(results)
        let longitude = results[0].geometry.location.lng()
        let latitude = results[0].geometry.location.lat()
        let loc = [latitude, longitude]
        console.log(loc)
        self.props.dispatch(change('editListInfo', 'loc', loc))
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
      console.log(predictions)
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

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit} className="flex-column">
        <Field name="phone" component={TextField} hintText="Phone" floatingLabelText="Phone"/>
        <Field name="email" component={TextField} hintText="Email" floatingLabelText="Email"/>
        <Field name="brief" component={TextField} hintText="Brief" floatingLabelText="Brief"/>
        <AutoComplete
          hintText="Address"
          floatingLabelText="Address"
          openOnFocus={true}
          fullWidth={true}
          filter={(address)=> {
            return address
          }}
          searchText={this.props.initialValues.address}
          dataSource={this.state.addressPredictions}
          onUpdateInput={this.handleAddressUpdateInput}
          onNewRequest={this.selectAddress}
          />
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

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}

export default connect(null, mapDispatchToProps)(EditListInfoForm);
