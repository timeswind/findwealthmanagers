import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import FlatButton from 'material-ui/FlatButton';

class MapBox extends Component {

  componentDidMount () {
    var self = this
    if (this.props.markerPosition) {
      var uluru = this.props.markerPosition;
      var map = new window.google.maps.Map(self.refs.mapbox, {
        zoom: this.props.zoom,
        center: uluru
      });
      new window.google.maps.Marker({
        position: uluru,
        map: map
      });
    }
  }

  render() {
    return (
      <div ref="mapbox" style={{height: this.props.height, width: this.props.width}}></div>
    );
  }
}

MapBox.defaultProps = {
  height: "200px",
  width: "100%",
  zoom: 4
};

MapBox.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  zoom: PropTypes.number,
  markerPosition: PropTypes.object
};

export default MapBox;
