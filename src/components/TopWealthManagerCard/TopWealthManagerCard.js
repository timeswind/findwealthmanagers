import React, { Component } from 'react';
import './TopWealthManagerCard.css';
import OssImage from '../OssImage/OssImage';

class TopWealthManagerCard extends Component {
  render() {
    const {manager} = this.props
    const managerName = (!!manager.name && manager.name) || manager.advisor.firstName + " " + manager.advisor.lastName
    const description = manager.brief
    return (
      <div className="twm-card">
        <div className="flex-row" style={{height: "200px", overflow: "hidden", padding: 8}}>
          {(manager.profileImage && manager.profileImage.key) && (<OssImage wrapperClass="flex-row align-center" ossKey={manager.profileImage.key} width={150} style={{width: "150px", borderRadius: 3}}></OssImage>)}
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
            <p className="default-paragraph-s" style={{margin: "0 16px"}}>
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TopWealthManagerCard;
