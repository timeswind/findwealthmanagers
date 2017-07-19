import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
class AddressAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressInput: (props.initialValue && props.initialValue.formattedAddress) || props.currentValue || "",
      addressPredictions: []
    };
    this.AddressAutoCompleteService = null
    this.geocoder = null
    this.searchAddressDebounceTimeout = null
    this.initGoolePlaceAutocomplete()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentValue !== this.props.currentValue) {
      this.setState({addressInput: nextProps.currentValue})
    }
  }

  selectAddress = (chosenAddress) => {
    var self = this
    this.geocoder.geocode({'address': chosenAddress}, function (results, status) {
      if (window.google !== 'undefined' && status === window.google.maps.GeocoderStatus.OK) {
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
    if (this.props.onAddressInput) {
      this.props.onAddressInput(address)
    }
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
    if (window.google) {
      this.AddressAutoCompleteService = new window.google.maps.places.AutocompleteService();
      this.geocoder = new window.google.maps.Geocoder();
    }
  }

  render() {
    const {addressInput, addressPredictions} = this.state
    const { style, wrapperClass, onKeyDown, underlineShow, hintText, floatingLabelText, openOnFocus, fullWidth } = this.props
    return (
      <div className={wrapperClass} style={style}>
        <AutoComplete
          onKeyDown={onKeyDown}
          underlineShow={underlineShow}
          hintText={hintText}
          floatingLabelText={floatingLabelText}
          openOnFocus={openOnFocus}
          fullWidth={fullWidth}
          filter={AutoComplete.noFilter}
          searchText={addressInput}
          dataSource={addressPredictions}
          onUpdateInput={this.handleAddressUpdateInput}
          onNewRequest={(address) => {
            this.selectAddress(address)
          }}
          />
      </div>
    );
  }
}

AddressAutoComplete.defaultProps = {
  hintText: 'Address',
  floatingLabelText: null,
  openOnFocus: true,
  fullWidth: true,
}

export default AddressAutoComplete;
