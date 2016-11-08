import React, { Component, PropTypes } from 'react';
import { Card, CardTitle } from 'material-ui/Card';

class TopWealthManagerCard extends Component {
  render() {
    return (
      <Card>
        <div className="flex-row" style={{height: "200px", overflow: "hidden"}}>
          <img src={this.props.image} style={{width: "150px"}} alt=""></img>
          <div style={{overflow: "hidden", marginBottom: 16}}>
            <CardTitle title={this.props.managerName} />
            <p className="default-paragraph" style={{margin: "0 16px"}}>
              {this.props.description}
            </p>
          </div>

        </div>
      </Card>
    );
  }
}

TopWealthManagerCard.propTypes = {
  managerName: PropTypes.string,
  companyName: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string
}

TopWealthManagerCard.defaultProps = {
  managerName: "Manager Name",
  companyName: "Company Name",
  description: "Discription for manager",
  image: "https://placeholdit.imgix.net/~text?txtsize=14&txt=150%C3%97250&w=150&h=200"
}

export default TopWealthManagerCard;
