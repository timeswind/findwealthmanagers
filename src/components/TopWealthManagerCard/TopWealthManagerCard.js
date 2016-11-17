import React, { Component, PropTypes } from 'react';
import './TopWealthManagerCard.css'
class TopWealthManagerCard extends Component {
  render() {
    const {manager} = this.props
    const image= (manager.profileImage && manager.profileImage.key) && (`https://wealthie.oss-us-east-1.aliyuncs.com/${manager.profileImage.key}?x-oss-process=image/resize,m_pad,h_200,w_150,color_FFFFFF`)
    const managerName = (!!manager.name && manager.name) || manager.advisor.firstName + " " + manager.advisor.lastName
    const description = manager.brief
    return (
      <div className="twm-card">
        <div className="flex-row" style={{height: "200px", overflow: "hidden", padding: 8}}>
          {image && (<img src={image} style={{width: "150px", borderRadius: 3}} alt=""></img>)}
          <div style={{overflow: "hidden", marginBottom: 16}}>
            <div className="t-w-m-card-wrapper">
              <span className="t-w-m-card-title">{managerName}</span>
            </div>
            <div style={{marginLeft: 16}}>
              <div className="flex-wrap flex-row flex-center">
                { manager.categories && manager.categories.map((category, index) => {
                  return (<div key={index}>{category.name}&nbsp;&nbsp;&nbsp;</div>)
                })}
              </div>
            </div>
            <p className="default-paragraph" style={{margin: "0 16px"}}>
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TopWealthManagerCard;
