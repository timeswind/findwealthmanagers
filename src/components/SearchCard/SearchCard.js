import React, { Component } from 'react';
import { Card } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import us_states from '../../assets/us_states.js';
import categories from '../../assets/categories.js'

const usStates = [];
const managerCategories = []

us_states.forEach((state) => {
  usStates.push(<MenuItem value={state.abbreviation} key={state.abbreviation} label={state.abbreviation} primaryText={state.name} />);
})

categories.forEach((category) => {
  managerCategories.push(<MenuItem value={category.code} key={category.code} label={category.name} primaryText={category.name} />);
})


class SearchCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usState: "",
      companyName: "",
      category: 1,
      addressPredictions: []
    };
    this.AddressAutoCompleteService = null
    this.searchAddressDebounceTimeout = null
    this.initGoolePlaceAutocomplete()
  }

  selectUsState = (event, index, value) => this.setState({ "usState": value });
  selectCategory = (event, index, value) => this.setState({ "category": value });

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
    this.AddressAutoCompleteService.getQueryPredictions({input: address}, function (predictions) {
      console.log(predictions)
      var results = [];
      predictions.forEach((prediction) => {
        results.push(prediction.description);
      })
      self.setState({
        addressPredictions: results
      });
    });
  }

  initGoolePlaceAutocomplete() {
    this.AddressAutoCompleteService = new window.google.maps.places.AutocompleteService();
  }

  render() {
    return (
      <Card className="search-card">
        <div className="flex-column" style={{padding: "4px 32px 32px 32px"}}>
          <div className="flex-row" style={{marginBottom: "0"}}>
            <SelectField
              floatingLabelText="State"
              value={this.state.usState}
              onChange={this.selectUsState}
              style={{flex: "30", marginRight: "16px"}}>
              {usStates}
            </SelectField>
            <AutoComplete
              hintText="Street"
              floatingLabelText="Street"
              fullWidth={true}
              openOnFocus={true}
              filter={AutoComplete.noFilter}
              dataSource={this.state.addressPredictions}
              onUpdateInput={this.handleAddressUpdateInput}
              style={{flex: "70"}}
              />
          </div>
          <div className="flex-row flex-center" style={{marginBottom: "16px"}}>
            <SelectField
              floatingLabelText="Category"
              value={this.state.category}
              onChange={this.selectCategory}
              style={{flex: 50, marginRight: "8px"}}>
              {managerCategories}
            </SelectField>
            <TextField
              floatingLabelText="Company Name(optional)"
              style={{flex: 50, marginLeft: "8px"}}>
            </TextField>
          </div>
          <FlatButton
            label="Find Your Advisors"
            labelStyle={{color: "#FFF"}}
            primary
            rippleColor="#B2DFDB"
            backgroundColor="#00BFA5"
            hoverColor="#26A69A"/>
        </div>
      </Card>
    );
  }
}

export default SearchCard;
