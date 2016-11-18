import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
class AddressAutoComplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addressInput: (props.initialValue && props.initialValue.formattedAddress) || "",
      addressPredictions: []
    };
    this.AddressAutoCompleteService = null
    this.geocoder = null
    this.searchAddressDebounceTimeout = null
    this.initGoolePlaceAutocomplete()
  }

  selectAddress = (chosenAddress) => {
    var self = this
    this.geocoder.geocode({'address': chosenAddress}, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        let longitude = results[0].geometry.location.lng()
        let latitude = results[0].geometry.location.lat()
        let loc = [longitude, latitude] //getjson format [ lng, lat ]
        self.props.onAddressSelect(chosenAddress, loc)
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  handleAddressUpdateInput = (address) => {
    this.setState({addressInput: address})
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

  render() {
    return (
        <div className={this.props.wrapperClass} style={this.props.style}>
          <AutoComplete
              hintText={this.props.hintText || "Address"}
              floatingLabelText={this.props.hintText || "Address"}
              openOnFocus={this.props.openOnFocus || true}
              fullWidth={this.props.fullWidth || true}
              filter={(address) => {
                return address
              }}
              searchText={this.state.addressInput}
              dataSource={this.state.addressPredictions}
              onUpdateInput={this.handleAddressUpdateInput}
              onNewRequest={(address) => {
                this.selectAddress(address)
              }}
          />
        </div>
    );
  }
}

export default AddressAutoComplete;
