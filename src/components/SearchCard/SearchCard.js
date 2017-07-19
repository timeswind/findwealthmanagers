import React, { Component } from 'react';
import { Card } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import categories from '../../assets/categories.js'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SearchActions from '../../redux/actions/search.js';
import { push } from 'react-router-redux'

const managerCategories = []

categories.forEach((category) => {
  managerCategories.push(<MenuItem value={category.code} key={category.code} label={category.name} primaryText={category.name} />);
})


class SearchCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: "",
      addressPredictions: []
    };
    this.AddressAutoCompleteService = null
    this.geocoder = null
    this.searchAddressDebounceTimeout = null
    this.initGoolePlaceAutocomplete()
  }

  selectCategory = (event, index, category_code) => {
    const { actions } = this.props
    actions.setSearchCategories([category_code])
  }
  selectAddress = (chosenAddress, index) => {
    const { actions } = this.props
    this.geocoder.geocode( { 'address': chosenAddress}, function(results, status) {

      if (status === window.google.maps.GeocoderStatus.OK) {
        console.log(results)
        let longitude = results[0].geometry.location.lng()
        let latitude = results[0].geometry.location.lat()
        let loc = [longitude, latitude]
        actions.setSearchCoordinate(loc)
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
    actions.setSearchAddress(chosenAddress)
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

  // handleCompanyNameInput = (event) => {
  //   const { actions } = this.props
  //   actions.setSearchCompanyName(event.target.value)
  // }

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
    if (window.google && window.google.maps) {
      this.AddressAutoCompleteService = new window.google.maps.places.AutocompleteService();
      this.geocoder = new window.google.maps.Geocoder();
    }
  }

  search = () => {
    const { dispatch } = this.props;
    if (this.props.path && this.props.path === 'home') {
      dispatch(push('/search'))
    } else {
      this.props.onSearch()
    }
  }

  render() {
    const {showCategoriesSelector} = this.props
    return (
      <Card className="search-card">
        <div className="flex-column" style={{padding: "4px 32px 32px 32px"}}>
          <div className="flex-row" style={{marginBottom: "0"}}>
            <AutoComplete
              hintText="Street"
              floatingLabelText="Street"
              fullWidth={true}
              openOnFocus={true}
              filter={AutoComplete.noFilter}
              dataSource={this.state.addressPredictions}
              onUpdateInput={this.handleAddressUpdateInput}
              searchText={this.props.search.address}
              onNewRequest={this.selectAddress}
              />
          </div>
          {showCategoriesSelector && (
            <div className="flex-row flex-center">
              <SelectField
                floatingLabelText="Category"
                value={this.props.search.categories[0]}
                onChange={this.selectCategory}
                style={{flex: 50, marginRight: "8px"}}>
                {managerCategories}
              </SelectField>
            </div>
          )}
          <div style={{marginTop: 16}} className="flex-column">
            <FlatButton
              label="Find Your Advisors"
              labelStyle={{color: "#FFF"}}
              primary
              rippleColor="#B2DFDB"
              backgroundColor="#00BFA5"
              hoverColor="#26A69A"
              onClick={this.search}/>
          </div>
        </div>
      </Card>
    );
  }
}

const mapStatesToProps = (states) => {
  return {
    search: states.search
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(SearchActions, dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(SearchCard);
