import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';

import './SearchResultCard.css';

class SearchResultCard extends Component {
  state = {
    briefExpend: false
  }
  toggleBrief() {
    this.setState({briefExpend: !this.state.briefExpend})
  }
  goToListDetail(e, id) {
    if (e.target.dataset && e.target.dataset.brief) {
      this.toggleBrief()
    } else {
      this.props.onSelect(id)
    }
  }
  render() {
    const { list } = this.props
    return (
      <div key={list._id} className="light-card flex-column" style={{cursor: "pointer"}}  onTouchTap={(e)=>{
          this.goToListDetail(e, list._id)
        }}>
        <div className="r-flex-row">
          <div className="s-r-list-sec-one">
            { (list.profileImage && list.profileImage.key) && (
              <img
                alt="profile"
                className="s-r-profile-image"
                src={`https://wealthie.oss-us-east-1.aliyuncs.com/${list.profileImage.key}?x-oss-process=image/resize,w_210,limit_0/format,jpg`}
                />
            )}
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
          <div className="s-r-list-sec-two">
            <div className="s-r-aoi" style={{borderBottom: "1px solid #ddd"}}>
              <div>Area of focus</div>
              <div className="flex-wrap flex-row flex-center">
                { list.categories.map((category) => {
                  return (<div className="s-category-label" key={category.code}>{category.name}</div>)
                }) }
              </div>
            </div>
            <div data-brief>
              <div data-brief className={"s-r-brief " + (this.state.briefExpend ? 's-r-brief-expend' : 's-r-brief-collapsed')}>
                {list.brief}
              </div>
              <div data-brief className="s-r-brief-show-more">{this.state.briefExpend ? 'Hide' : 'Show more'}</div>
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
    );
  }
}

// TopWealthManagerCard.propTypes = {
//   managerName: PropTypes.string,
//   companyName: PropTypes.string,
//   description: PropTypes.string,
//   image: PropTypes.string
// }
//
// TopWealthManagerCard.defaultProps = {
//   managerName: "Manager Name",
//   companyName: "Company Name",
//   description: "Discription for manager",
//   image: null
// }

export default SearchResultCard;
