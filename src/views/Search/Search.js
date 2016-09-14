import React, { Component } from 'react';
// import { Card } from 'material-ui/Card';
// import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import MainFooter from '../../components/MainFooter/MainFooter'
import TopWealthManagerCard from '../../components/TopWealthManagerCard/TopWealthManagerCard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SearchActions from '../../redux/actions/search';
// import { push } from 'react-router-redux'
import SearchCard from '../../components/SearchCard/SearchCard'
import categories from '../../assets/categories'

class Search extends Component {
  state = {
    found: false,
    results: []
  }

  componentDidMount() {
    this.search()
  }

  search = () => {
    var self = this
    const categories = this.props.search.categories
    const loc = this.props.search.coordinate
    fetch('/api/public/search?categories=' + categories +'&lat=' + loc[1] + '&long=' + loc[0], {
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
        if (json.listInfo.length > 0) {
          self.updateResults(json.listInfo)
        }
      } else {
        // self.props.dispatch(push('/'))
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  updateResults(results) {
    console.log(results)
    results.map((result) => {
      result.categories = result.categories.map((category_code) => {
        return categories[category_code - 1]
      })
      return (
        result
      )
    })

    this.setState({
      found: true,
      results: results
    })
  }

  render() {

    return (
      <div className="search">
        <div className="g-background" style={{padding: "77px 0"}}>
          <div style={{maxWidth: "860px", margin: '32px auto 0 auto'}}>
            <SearchCard onSearch={this.search}></SearchCard>
            { this.state.found ? (
              <div className="flex-column">
                { this.state.results.map((list) => {
                  return (
                    <div key={list._id} className="light-card flex-row" style={{cursor: "pointer"}}>
                      <div className="flex-column align-center default-padding raleway" style={{flex: 30}}>
                        <Avatar
                          src="http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-tech-guy.png"
                          size={100}
                          />
                        <span style={{margin: "8px 0", fontSize: "20px", fontWeight: 600}}>{list.advisor.firstName + " " + list.advisor.lastName}</span>
                      </div>
                      <div className="flex-column" style={{flex: 70, borderLeft: "1px solid #ddd"}}>
                        <div className="flex-row flex-center raleway default-padding" style={{borderBottom: "1px solid #ddd"}}>
                          <div style={{marginRight: "16px"}}>Consulting area:</div>
                          { list.categories.map((category) => {
                            return (<div className="p-category-label" key={category.code}>{category.name}</div>)
                          }) }
                        </div>
                        <div className="flex-row flex-center default-padding">
                          {list.brief}
                        </div>
                        <div className="flex-row flex-center raleway default-padding" style={{borderTop: "1px solid #ddd"}}>
                          <FontIcon className="material-icons" style={{ marginRight: "8px", color: "#666"}}>location_on</FontIcon>
                          <span>{list.address}</span>
                        </div>
                      </div>
                    </div>
                  )
                }) }
              </div>
            ) : null }
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
