import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as InternalActions from '../../../redux/actions/internal';
import axios from 'axios';
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import NewPublicAdvisorForm from '../../../forms/NewPublicAdvisorForm/NewPublicAdvisorForm';

class ManagePublicInfoView extends Component {
  state = {
    selectedAdvisor: {}
  }
  componentWillMount() {
    this.initAdvisorsData()
  }

  initAdvisorsData() {
    const { actions } = this.props
    axios.get('/api/internal/lists/unclaimed')
    .then((response) => {
      if (response.data && response.data.success && response.data.listInfo) {
        actions.interSetPublicAdvisors(response.data.listInfo)
      }
    })
  }

  handleFormSubmit = (form) => {
    var self = this
    if (this.state.selectedAdvisor && this.state.selectedAdvisor._id) {
      axios.put('/api/internal/lists/unclaimed', form)
      .then((response) => {
        self.setState({selectedAdvisor: {}})
        self.initAdvisorsData()
      })
    } else {
      axios.post('/api/internal/lists/unclaimed', form)
      .then((response) => {
        self.setState({selectedAdvisor: {}})
        self.initAdvisorsData()
      })
    }
  }

  handleListDelete = (id) => {
    var self = this
    if (id) {
      axios.delete('/api/internal/lists/unclaimed?id=' + id)
      .then((response) => {
        if (response.data && response.data.success) {
          self.setState({selectedAdvisor: {}})
          self.initAdvisorsData()
        }
      })
    }
  }

  render() {
    const { actions, auth } = this.props
    const { publicAdvisors } = this.props.internal
    return (
      <div>
        <div className="left-panel-fix">
          <div className="flex-column default-padding">
            <FlatButton
              label="List new advisor"
              backgroundColor="rgb(48, 73, 102)"
              hoverColor="rgba(48, 73, 102, 0.8)"
              style={{color: '#fff'}}
              onTouchTap={()=>{
                actions.internalSetNewPublicAdvisorFormStatus(true)
                this.setState({selectedAdvisor: {}})
              }}
              />
            <span style={{marginTop: 8, color: "#999"}}>total {publicAdvisors.length} lists</span>
          </div>
          <List>
            { publicAdvisors.length > 0 && publicAdvisors.map((advisor)=>{
              var createdBySelf = false
              if (advisor.listBy && advisor.listBy._id && auth.id) {
                createdBySelf = (auth.id === advisor.listBy._id)
              }
              return (
                <ListItem
                  style={createdBySelf && { backgroundColor: "rgb(245, 245, 245)" }}
                  onTouchTap={()=>{this.setState({selectedAdvisor: advisor})}}
                  key={advisor._id}
                  primaryText={<span style={createdBySelf && { color: "#E91E63" }}>{advisor.name}{!advisor.profileImage && (<span style={{color: "#3F51B5"}}> --No Image--</span>)}</span>}
                  secondaryText={advisor._id}/>
                )
              })}
            </List>
          </div>
          <div className="right-panel" style={{margin: "0 16px"}}>
            <div className="light-card default-padding">
              <NewPublicAdvisorForm onSubmit={this.handleFormSubmit} initialValues={this.state.selectedAdvisor} enableReinitialize={true} handleListDelete={this.handleListDelete}></NewPublicAdvisorForm>
            </div>
          </div>
        </div>
      )
    }
  }

  const mapStatesToProps = (states) => {
    return {
      auth: states.auth,
      internal: states.internal,
    };
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(InternalActions, dispatch)
    };
  }

  export default connect(mapStatesToProps, mapDispatchToProps)(ManagePublicInfoView);
