import React, {Component} from 'react';
import MainFooter from '../../components/MainFooter/MainFooter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as SearchActions from '../../redux/actions/search';
import {push} from 'react-router-redux';
import SearchCard from '../../components/SearchCard/SearchCard';
import categories from '../../assets/categories';
import SearchResultCard from '../../components/SearchResultCard/SearchResultCard';
import ReactPaginate from 'react-paginate';
import './Search.css';
class Search extends Component {
  componentDidMount() {
    this.search()
  }

  search = (page) => {
    const {search} = this.props
    var self = this
    var apiURL = '/api/public/search?version=1'
    if (search.categories) {
      apiURL = `${apiURL}&categories=${search.categories}`
    }
    if (page) {
      apiURL = `${apiURL}&page=${page}`
    }
    const loc = search.coordinate
    if (loc[1] && loc[0]) {
      fetch(apiURL + '&lat=' + loc[1] + '&long=' + loc[0], {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(function (response) {
        return response.json()
      }).then(function (json) {
        console.log(json)
        if (json.success === true) {
          if (json.count && json.count > 0 && json.listInfo && json.listInfo.length > 0) {
            self.updateResults(json.count, json.listInfo)
          } else {
            self.updateResults(null, null)
          }
        } else {
          // self.props.dispatch(push('/'))
        }
      }).catch(function (ex) {
        console.log('failed', ex)
      })
    }
  }

  updateResults(count, results) {
    const {actions} = this.props
    if (results === null) {
      actions.setSearchResults([], false)
      actions.setSearchPagination(null, null)
    } else {
      results.map((result) => {
        if (result.categories) {
          result.categories = result.categories.map((category_code) => {
            return categories[category_code - 1]
          })
        }
        return (
          result
        )
      })
      actions.setSearchResults(results, true)
      let results_count = count
      let listPerPage = 10
      if (results_count > listPerPage) {
        actions.setSearchPagination(listPerPage, Math.ceil(results_count / listPerPage))
      } else {
        actions.setSearchPagination(null, null)
      }
      window.scrollTo(0, 0)
    }
  }

  goToListDetail = (id) => {
    console.log(id)
    var path = '/p/' + id
    this.props.dispatch(push(path))
  }

  handlePageClick = (data) => {
    this.search(data.selected + 1)
  };

  render() {
    const {results, found, pageNum } = this.props.search
    return (
      <div className="search">
        <div className="g-background" style={{padding: "77px 0"}}>
          <div style={{maxWidth: "860px", margin: '32px auto 0 auto'}}>
            <SearchCard onSearch={this.search}></SearchCard>
            {(found === true) && (
              <div className="flex-column">
                {
                  results.map(
                    (list) => {
                      return (
                        <SearchResultCard list={list} key={list._id} onSelect={this.goToListDetail}></SearchResultCard>
                      )
                    }
                  )
                }
              </div>
            )}
            { !!pageNum && (
              <div className="component-pagination-wrapper">
                <ReactPaginate previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={<span>...</span>}
                  breakClassName={"break-me"}
                  pageCount={pageNum}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={"component-pagination"}
                  subContainerClassName={"pagination"}
                  activeClassName={"active"}/>
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
