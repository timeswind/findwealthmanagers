import React, {Component} from 'react';
import AddressAutoComplete from '../AddressAutoComplete/AddressAutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SearchActions from '../../redux/actions/search.js';
class AddressSearchBar extends Component {
  onAddressSelect = (address, loc) => {
    const { actions } = this.props
    if (address) {
      actions.setSearchAddress(address)
    }
    if (loc) {
      actions.setSearchCoordinate(loc)
    }
  }
  handleKeyPress = (target) => {
    if (target.keyCode === 13) {
      this.props.onSearch()
    }
  }
  render() {
    return (
      <div className={this.props.wrapperClass} style={this.props.style}>
        <div className="light-card flex-row flex-center">
          <AddressAutoComplete onAddressSelect={this.onAddressSelect} style={{paddingLeft: 16, flex: 1}} underlineShow={false} hintText="Where do you live?" onKeyDown={this.handleKeyPress}></AddressAutoComplete>
          <RaisedButton label="Search" primary={true} style={{marginRight: 8}} onTouchTap={this.props.onSearch}/>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(SearchActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(AddressSearchBar);
