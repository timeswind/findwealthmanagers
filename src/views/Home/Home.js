import React, { Component } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SearchCard from '../../components/SearchCard/SearchCard';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import TopWealthManagerCard from '../../components/TopWealthManagerCard/TopWealthManagerCard';
import mockManagersData from '../../mockdata/managers';

const mockTopManagers = [];

const headerWrapperStyle = {
  margin: "0 auto",
  maxWidth: "600px"
}

const TopWealthManagerCardStyle = {
  margin: "16px"
}

mockManagersData.forEach((mockManagerData) => {
  mockTopManagers.push(
    <div className="flex-column flex-home-card-d" style={TopWealthManagerCardStyle} key={mockManagerData.name}>
      <TopWealthManagerCard
        managerName={mockManagerData.name}
        description={mockManagerData.description}
        />
    </div>
  );
})

class Home extends Component {
  render() {
    return (
      <div className="home">
        <Navbar></Navbar>
        <div className="App-header">
          <div style={headerWrapperStyle}>
            <h2 className="header-promot">Easily Find Wealth Managers Near You.</h2>
            <SearchCard></SearchCard>
          </div>
        </div>
        <div className="App-body">
          <div style={{backgroundColor: "#f6f6f6"}}>

            <div className="main-wrapper flex-column">

              <div className="flex-row flex-wrap raleway" style={{padding: "16px 0"}}>
                <div className="flex-column flex-33-d flex-center home-feature-card">
                  <FontIcon
                    className="material-icons"
                    style={{fontSize: "50px"}}>
                    search
                  </FontIcon>
                  <span style={{fontWeight: 600, fontSize: "26px"}}>Search</span>
                  <p>Find Wealth Managers</p>
                </div>
                <div className="flex-column flex-33-d flex-center home-feature-card">
                  <FontIcon
                    className="material-icons"
                    style={{fontSize: "50px"}}>
                    check_circle
                  </FontIcon>
                  <span style={{fontWeight: 600, fontSize: "26px"}}>Review</span>
                  <p>Compare Wealth Managers</p>
                </div>
                <div className="flex-column flex-33-d flex-center home-feature-card">
                  <FontIcon
                    className="material-icons"
                    style={{fontSize: "50px"}}>
                    message
                  </FontIcon>
                  <span style={{fontWeight: 600, fontSize: "26px"}}>Connect</span>
                  <p>Contact Managers You Like</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="xl-wrapper flex-column">
              <p className="home-headline raleway overline">Top Wealth Managers</p>
              <div className="flex-row flex-wrap raleway" style={{padding: "16px 0"}}>
                {mockTopManagers}
              </div>
            </div>
          </div>
          <div className="flex-column flex-center" style={{backgroundColor: "#f6f6f6", padding: "32px 16px", textAlign: "center"}}>
            <p className="raleway" style={{fontSize: "32px", fontWeight: "600"}}>Are You A Wealth Manager?</p>
            <p className="raleway" style={{maxWidth: '600px', margin: "0 0 32px 0"}}>
              Finding Wealth Managers is easy! Search our website to instantly connect with Wealth Managers. For Wealth Managers, our website works as a powerful tool for attracting more clients.
            </p>
            <FlatButton
              label="GET LISTED TODAY"
              labelStyle={{color: "#FFF"}}
              primary
              rippleColor="#B2DFDB"
              backgroundColor="#00BFA5"
              hoverColor="#26A69A"
              style={{margin: "0 16px"}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
