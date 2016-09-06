import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
// import withRouter from 'react-router/lib/withRouter'

class Search extends Component {
  render() {

    return (
      <div className="search">

      </div>
    );
  }
}

Search.PropTypes = {
  state: PropTypes.string,
  address: PropTypes.string,
  coordinate: React.PropTypes.arrayOf(React.PropTypes.shape({
    longitude: React.PropTypes.number,
    latitude: React.PropTypes.number,
  })),
  types: PropTypes.array,
  companyName: PropTypes.string
}

export default Search;
