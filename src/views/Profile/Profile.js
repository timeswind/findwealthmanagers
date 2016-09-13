import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import { connect } from 'react-redux';
import fetch from '../../core/fetch/fetch';
import { gray400 } from 'material-ui/styles/colors';

import categories from '../../assets/categories'

import './Profile.css'

const iconStyles = {
  marginRight: "8px",
  color: "#666"
};

class Profile extends Component {
  state = {
    tab: "brief",
    name: "",
    location: "",
    email: "",
    affiliation: "",
    brief: "",
    categories: []
  }
  componentWillMount() {
    console.log('componentWillMount')
    let self = this
    fetch('/api/public/list?id=' + this.props.routeParams.id, {
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
        var formattedCategories = []
        json.listInfo.categories.forEach((category_code) => {
          formattedCategories.push(categories[category_code - 1])
        })
        console.log(formattedCategories)
        self.setState({
          name: json.advisorInfo.firstName + " " + json.advisorInfo.lastName,
          email: json.listInfo.email,
          location: json.listInfo.address,
          affiliation: json.listInfo.affiliation,
          categories: formattedCategories,
          brief: json.listInfo.brief,
          experience: json.listInfo.experience
        })
      } else {
        // self.props.dispatch(push('/'))
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleTabChange = (value) => {
    this.setState({
      tab: value,
    });
  };

  render() {
    return (
      <div className="view-body flex-column g-background">
        <div className="g-background">
          <div className="profile-header raleway">
            <div className="p-h-wrapper">
              <div className="flex-column">
                <div className="p-h-avatar">
                  <Avatar
                    src="http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-tech-guy.png"
                    size={120}
                    />
                </div>
              </div>
              <div className="flex align-center justify-center">
                <div className="flex-column" style={{marginLeft: "32px"}}>
                  <span style={{marginBottom: "8px", fontSize: "24px", fontWeight: 600}}>{this.state.name}</span>
                  <div className="flex-row flex-center" style={{marginBottom: "8px"}}>
                    <FontIcon className="material-icons" style={iconStyles}>location_on</FontIcon>
                    <span>{this.state.location}</span>
                  </div>
                  <div className="flex-row flex-center" style={{marginBottom: "8px"}}>
                    <FontIcon className="material-icons" style={iconStyles} color={gray400}>email</FontIcon>
                    <span>{this.state.email}</span>
                  </div>
                  { this.state.affiliation !== "" ? (
                    <div className="flex-row flex-center">
                      <FontIcon className="material-icons" style={iconStyles} color={gray400}>work</FontIcon>
                      <span>{this.state.affiliation}</span>
                    </div>
                  ) : (
                    <div className="flex-row flex-center">
                      <FontIcon className="material-icons" style={iconStyles} color={gray400}>work</FontIcon>
                      <span>Independent</span>
                    </div>
                  ) }
                </div>
              </div>
              <div className="flex align-center justify-center" style={{marginLeft: "auto"}}>
                <div>
                  <FlatButton
                    label="LIKE"
                    labelStyle={{color: "#FFF"}}
                    primary
                    rippleColor="#B2DFDB"
                    backgroundColor="#00BFA5"
                    hoverColor="#26A69A"/>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-column p-categories flex-center">
            <div className="flex-row flex-center raleway">
              <div style={{marginRight: "16px"}}>Consulting area:</div>
              { this.state.categories.map((category) => {
                return (<div className="p-category-label" key={category.code}>{category.name}</div>)
              }) }
            </div>
          </div>
          <div className="profile-body">
            <div className="p-tabs-outter-wrapper">
              <div className="p-tabs-inner-wrapper">

                <Tabs
                  value={this.state.tab}
                  onChange={this.handleTabChange}
                  >
                  <Tab label="Brief" value="brief" style={{backgroundColor: "#fff", color: "#333"}}>

                    <div className="p-tab-wrapper">
                      <h2>Brief</h2>
                      <p>
                        {this.state.brief}
                      </p>
                    </div>
                    <div className="p-tab-wrapper">
                      <h2>Experience</h2>
                      { this.state.experience ? this.state.experience.map((experience, index) => {
                        return (
                          <div key={index} style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "16px"}}>
                            <span style={{fontWeight: 600, fontSize: "20px"}}>{experience.title}</span>
                            <p style={{margin: "8px 0 0 0", fontSize: "14px"}}>{experience.text}</p>
                          </div>
                        )
                      }) : null}
                    </div>

                  </Tab>
                  <Tab label="Calendar" value="calendar" style={{backgroundColor: "#fff", color: "#333"}}>

                    <div className="p-tab-wrapper">
                      <h2>Calendar</h2>
                      <p>
                        place to show advisor's appointment calendar
                      </p>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}


export default connect(mapStatesToProps, mapDispatchToProps)(Profile);
