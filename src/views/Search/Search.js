import React, { Component } from 'react';
// import { Card } from 'material-ui/Card';
// import FlatButton from 'material-ui/FlatButton';
import MainFooter from '../../components/MainFooter/MainFooter'
import TopWealthManagerCard from '../../components/TopWealthManagerCard/TopWealthManagerCard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SearchActions from '../../redux/actions/search';
// import { push } from 'react-router-redux'
import SearchCard from '../../components/SearchCard/SearchCard'

import mockManagersData from '../../mockdata/managers';

const TopWealthManagerCardStyle = {
  margin: "16px",
  flex: "1 1 auto"
}

const mockTopManagers = [];
mockManagersData.forEach((mockManagerData) => {
  mockTopManagers.push(
    <div className="flex-column" style={TopWealthManagerCardStyle} key={mockManagerData.name}>
      <TopWealthManagerCard
        managerName={mockManagerData.name}
        description={mockManagerData.description}
        />
    </div>
  );
})

class Search extends Component {
  componentDidMount() {
    console.log(this.props.search)
    const categories = this.props.search.categories
    const loc = this.props.search.coordinate
    fetch('/api/public/search?categories=' + categories +'&lat=' + loc[0] + '&long=' + loc[1], {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
      if (json.success === true) {

      } else {
        // self.props.dispatch(push('/'))
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }
  render() {

    return (
      <div className="search">
        <div className="g-background" style={{padding: "77px 0"}}>
          <div style={{maxWidth: "860px", margin: '32px auto 0 auto'}}>
            <SearchCard></SearchCard>
            <div>{mockTopManagers}</div>

          </div>
        </div>
        <MainFooter></MainFooter>
      </div>
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

export default connect(mapStatesToProps, mapDispatchToProps)(Search);
