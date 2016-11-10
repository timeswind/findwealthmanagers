import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import MainFooter from '../../components/MainFooter/MainFooter'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SearchActions from '../../redux/actions/search';
import { push } from 'react-router-redux'
import SearchCard from '../../components/SearchCard/SearchCard'
import categories from '../../assets/categories'
import './Search.css'
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
        } else {
          self.updateResults(null)
        }
      } else {
        // self.props.dispatch(push('/'))
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  updateResults(results) {
    if (results === null) {
      this.setState({
        found: false,
        results: []
      })
    } else {
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
  }

  goToListDetail(id) {
    var path = '/p/' + id
    this.props.dispatch(push(path))
  }

  render() {

    return (
      <div className="search">
        <div className="g-background" style={{padding: "77px 0"}}>
          <div style={{maxWidth: "860px", margin: '32px auto 0 auto'}}>
            <SearchCard onSearch={this.search}></SearchCard>
            { this.state.found && (
              <div className="flex-column">
                { this.state.results.map((list) => {
                  return (
                    <div key={list._id} className="light-card flex-column" style={{cursor: "pointer"}}  onClick={()=>{
                        this.goToListDetail(list._id)
                      }}>
                      <div className="r-flex-row">
                        <div className="flex-column align-center default-padding raleway" style={{flex: 30}}>
                          <Avatar
                            src="http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-tech-guy.png"
                            size={100}
                            />
                          <span style={{margin: "8px 0", fontSize: "20px", fontWeight: 600}}>
                            {
                              (!!list.name && list.name) ||
                              list.advisor.firstName + " " + list.advisor.lastName
                            }
                          </span>
                            {
                              list.email && (
                                <span className="s-r-email">
                                  {list.email}
                                </span>
                              )
                            }
                            {
                              list.phone && (
                                <span className="s-r-phone">
                                  {list.phone}
                                </span>
                              )
                            }
                        </div>
                        <div className="flex-column" style={{flex: 70, borderLeft: "1px solid #ddd"}}>
                          <div className="s-r-aoi" style={{borderBottom: "1px solid #ddd"}}>
                            <div>Area of focus</div>
                              <div className="flex-wrap flex-row flex-center">
                              { list.categories.map((category) => {
                                return (<div className="s-category-label" key={category.code}>{category.name}</div>)
                              }) }
                            </div>
                          </div>
                          <div className="s-r-brief">
                            {list.brief}
                          </div>
                        </div>
                      </div>
                      {list.address && (
                        <div className="s-r-address" style={{borderTop: "1px solid #ddd"}}>
                          <FontIcon className="material-icons" style={{ marginRight: "8px", color: "#666"}}>location_on</FontIcon>
                          <span>{list.address}</span>
                        </div>
                      )}
                    </div>
                  )
                }) }
              </div>
            )}
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
