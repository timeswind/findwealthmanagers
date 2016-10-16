import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import SearchCard from '../../components/SearchCard/SearchCard';
import MainFooter from '../../components/MainFooter/MainFooter';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import TopWealthManagerCard from '../../components/TopWealthManagerCard/TopWealthManagerCard';
// import mockManagersData from '../../mockdata/managers';
import * as AuthActions from '../../redux/actions/auth.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

// const mockTopManagers = [];

const headerWrapperStyle = {
  margin: "0 auto",
  maxWidth: "600px"
}

const TopWealthManagerCardStyle = {
  flex: "50 1 50%",
  cursor: "pointer"
}


class Home extends Component {
  state = {
    userMenuOpen: false,
    topManagers: []
  }

  componentWillMount() {
    this.getTopManagers()
  }

  getTopManagers() {
    let self = this
    fetch('/api/public/topmanagers', {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
      if (json.success && json.topmanagers) {
        self.setState({topManagers: json.topmanagers})
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleUserManuTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      userMenuOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      userMenuOpen: false,
    });
  };


  logout() {
    const { actions } = this.props;
    actions.logout()
  }

  routerPush (path) {
    this.props.dispatch(push(path))
  }
  render() {
    return (
      <div className="home">
        <div className="Home-App-header">
          <div className="home-navbar">
            <a className="nav-brand-text-white">WEALTHIE</a>
            { this.props.auth.isLogin ? (
              <div className="flex-row flex-center" style={{marginLeft: "auto"}}>
                <div className="raleway">
                  <div className="flex-row flex-center"
                    onTouchTap={this.handleUserManuTouchTap}
                    style={{cursor: "pointer", backgroundColor:"rgba(0, 0, 0, 0.5)", padding: "8px 16px", borderRadius: "3px"}}>
                    <span>{this.props.auth.name}</span>
                    <FontIcon
                      className="material-icons"
                      style={{fontSize: "20px", color: "#fff"}}>
                      keyboard_arrow_down
                    </FontIcon>
                  </div>
                  <Popover
                    open={this.state.userMenuOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}
                    >
                    <Menu>
                      <MenuItem primaryText="Dashboard"
                        onTouchTap={()=>{
                          this.routerPush('/dashboard')
                          this.handleRequestClose()
                        }}
                        />
                      <MenuItem primaryText="Client Book"
                        onTouchTap={()=>{
                          this.routerPush('/dashboard/clients')
                          this.handleRequestClose()
                        }}
                        />
                      <MenuItem primaryText="Sign out"
                        onTouchTap={()=>{
                          this.logout()
                          this.handleRequestClose()
                        }}
                        />
                    </Menu>
                  </Popover>
                </div>
              </div>
            ) : (
              <div className="flex-row" style={{marginLeft: "auto"}}>
                <div className="flex-row flex-center login-signup-wrapper" style={{marginRight: "16px"}}>
                  <FlatButton
                    label="Login/Signup"
                    hoverColor="#2a8a2d"
                    backgroundColor="#32b337"
                    style={{color: "#fff"}}
                    onTouchTap={() => {
                      this.routerPush('/login')
                    }}
                    />
                </div>
                { this.props.path !== '/getlisted' ? (
                  <FlatButton
                    backgroundColor="rgba(0, 0, 0, 0.5)"
                    hoverColor="rgba(0, 0, 0, 0.7)"
                    rippleColor="rgba(0, 0, 0, 0.9)"
                    style={{color: "#fff"}}
                    label="GET LISTED TODAY"
                    onTouchTap={() => {
                      this.routerPush('/getlisted')
                    }}
                    />
                ) : null}

              </div>
            )}
          </div>
          <div style={headerWrapperStyle} className="home-search-field">
            <h2 className="header-promot">Easily Find Wealth Managers Near You.</h2>
            <SearchCard path="home"></SearchCard>
          </div>
        </div>
        <div className="App-body">
          <div className="g-background">

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
          <div style={{backgroundColor: "#fff"}}>
            <div className="xl-wrapper flex-column">
              <p className="home-headline raleway overline">Top Wealth Managers</p>
              <div className="flex-row flex-wrap raleway" style={{padding: "16px 0"}}>
                { this.state.topManagers.map((manager)=>{
                  return (
                    <div className="flex-column" style={TopWealthManagerCardStyle} key={manager._id} onTouchTap={()=>{
                        this.routerPush('/p/' + manager._id)
                      }}>
                      <div style={{margin: "16px"}}>
                        <TopWealthManagerCard
                          managerName={manager.advisor.firstName + " " + manager.advisor.lastName}
                          description={manager.brief}
                          />
                      </div>
                    </div>
                  )
                })
                 }
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
              style={{margin: "0 16px"}}
              onClick={()=>{ this.props.dispatch(push('/getlisted'))}}/>
          </div>
        </div>
        <MainFooter></MainFooter>

      </div>
    );
  }
}
const mapStatesToProps = (state) => {
  return {
    path: state.routing.locationBeforeTransitions.pathname,
    auth: state.auth
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(AuthActions, dispatch)
  };
}


export default connect(mapStatesToProps, mapDispatchToProps)(Home);
