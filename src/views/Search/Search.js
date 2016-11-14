import React, { Component } from 'react';
import MainFooter from '../../components/MainFooter/MainFooter';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SearchActions from '../../redux/actions/search';
import { push } from 'react-router-redux';
import SearchCard from '../../components/SearchCard/SearchCard';
import categories from '../../assets/categories';
import SearchResultCard from '../../components/SearchResultCard/SearchResultCard';
import './Search.css';
class Search extends Component {
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
    const { actions } = this.props
    if (results === null) {
      actions.setSearchResults([], false)
    } else {
      results.map((result) => {
        result.categories = result.categories.map((category_code) => {
          return categories[category_code - 1]
        })
        return (
          result
        )
      })
      actions.setSearchResults(results, true)
    }
  }

  goToListDetail = (id) => {
    console.log(id)
    var path = '/p/' + id
    this.props.dispatch(push(path))
  }

  render() {
    const { results, found } = this.props.search
    return (
      <div className="search">
        <div className="g-background" style={{padding: "77px 0"}}>
          <div style={{maxWidth: "860px", margin: '32px auto 0 auto'}}>
            <SearchCard onSearch={this.search}></SearchCard>
            { (found === true) && (
              <div className="flex-column">
                { results.map((list) => {
                  return (
                    <SearchResultCard list={list} key={list._id} onSelect={this.goToListDetail}></SearchResultCard>
                  )
                })
              }
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
