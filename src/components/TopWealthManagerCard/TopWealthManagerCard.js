import React, { Component, PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class TopWealthManagerCard extends Component {
  render() {
    return (
      <Card>
        <div className="flex-row">
          <img src={this.props.image}></img>
          <div>
            <CardTitle title={this.props.managerName} />
            <CardText>
              {this.props.description}
            </CardText>
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
