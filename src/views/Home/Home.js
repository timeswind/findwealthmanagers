import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import AddressSearchBar from '../../components/AddressSearchBar/AddressSearchBar';
import MainFooter from '../../components/MainFooter/MainFooter';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
// import TopWealthManagerCard from '../../components/TopWealthManagerCard/TopWealthManagerCard';
import axios from 'axios';
import * as AuthActions from '../../redux/actions/auth';
import * as ViewActions from '../../redux/actions/view';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import categories from '../../assets/categories';
import './Home.css'

class Home extends Component {
  state = {
    userMenuOpen: false,
    topManagers: [],
  }

  componentWillMount() {
    this.getTopManagers()
  }

  getTopManagers() {
    let self = this
    axios.get('/api/public/topmanagers')
    .then(function(response) {
      if (response.data.success && response.data.topmanagers) {
        response.data.topmanagers.map((result) => {
          if (result.categories) {
            result.categories = result.categories.map((category_code) => {
              return categories[category_code - 1]
            })
            return (
              result
            )
          } else {
            return {}
          }
        })
        self.setState({topManagers: response.data.topmanagers})
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

  onSearchAdvisor = () => {
    this.props.dispatch(push('/search'))
  }

  routerPush (path) {
    this.props.dispatch(push(path))
  }
  render() {
    const { isLogin, listed } = this.props.auth
    const { drawer } = this.props.view
    const { actions } = this.props
    const { agentbook } = this.props.functions
    return (
      <div className="home">
        <div className="Home-App-header">
          <div className="home-navbar">
            <a className="nav-brand-text-white">WEALTHIE</a>
            <span className="nav-item-home" onTouchTap={()=>{
                var win = window.open('https://blog.wealthie.co', '_blank')
                win.focus()
              }}>Blog</span>
              <div className="login-signup-wrapper"  style={{marginLeft: "auto"}}>
                { isLogin ? (
                  <div className="flex-row flex-center raleway">
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
                      {
                        this.props.auth.role !== 1 ? (
                          <Menu>
                            <MenuItem primaryText="Dashboard"
                              onClick={()=>{
                                this.routerPush('/dashboard')
                                this.handleRequestClose()
                              }}
                              />
                            { agentbook && (
                              <MenuItem primaryText="Baseshop"
                                onClick={()=>{
                                  this.routerPush('/dashboard/agents')
                                  this.handleRequestClose()
                                }}
                                />
                            )}
                            <MenuItem primaryText="Client Book"
                              onClick={()=>{
                                this.routerPush('/dashboard/clients')
                                this.handleRequestClose()
                              }}
                              />
                            <MenuItem primaryText="Sign out"
                              onClick={()=>{
                                this.logout()
                                this.handleRequestClose()
                              }}
                              />
                          </Menu>
                        ) : (
                          <Menu>
                            <MenuItem primaryText="Dashboard"
                              onClick={()=>{
                                this.routerPush('/dashboard')
                                this.handleRequestClose()
                              }}
                              />
                            <MenuItem primaryText="Sign out"
                              onClick={()=>{
                                this.logout()
                                this.handleRequestClose()
                              }}
                              />
                          </Menu>
                        )
                      }
                    </Popover>
                  </div>
                ) : (
                  <div className="flex-row flex-center" style={{marginRight: "16px"}}>
                    <FlatButton
                      label="Login/Signup"
                      backgroundColor="#4CAF50"
                      hoverColor="#388E3C"
                      style={{color: "#fff"}}
                      onTouchTap={() => {
                        this.routerPush('/login')
                      }}
                      />
                  </div>
                )}
              </div>
              <IconButton className="home-nav-menu" onTouchTap={()=>{
                  actions.setViewDrawerStatus(!drawer)
                }}>
                <FontIcon className="material-icons" color="#fff">menu</FontIcon>
              </IconButton>
            </div>
            <div className="home-search-field">
              { (!isLogin || !listed) && (
                <FlatButton
                  backgroundColor="#fff"
                  hoverColor="#fafafa"
                  style={{color: "rgb(48, 73, 102)"}}
                  label="GET LISTED TODAY"
                  onTouchTap={() => {
                    this.routerPush('/getlisted')
                  }}
                  />
              ) }
              <h2 className="header-promot">Professional financial service for everyone, everywhere</h2>
              <AddressSearchBar onSearch={this.onSearchAdvisor}></AddressSearchBar>
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
            { /*
              <div style={{backgroundColor: "#fafafa"}}>
                <div className="xl-wrapper flex-column">
                  <p className="home-headline raleway overline">Financial Professionals</p>
                  <div className="flex-row home-top-managers raleway">
                    { this.state.topManagers.map((manager)=>{
                      return (
                        <div className="flex-column home-top-manager" key={manager._id} onTouchTap={()=>{
                            this.routerPush('/p/' + manager._id)
                          }}>
                          <TopWealthManagerCard
                            manager={manager}
                            />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            */}
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
const mapStatesToProps = (states) => {
  return {
    auth: states.auth,
    view: states.view,
    functions: states.functions
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(Object.assign({}, AuthActions, ViewActions), dispatch)
  };
}


export default connect(mapStatesToProps, mapDispatchToProps)(Home);
