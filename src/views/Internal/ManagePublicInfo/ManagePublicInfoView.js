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
  render() {
    const { actions } = this.props
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
          </div>
          <List>
            { publicAdvisors.length > 0 && publicAdvisors.map((advisor)=>{
              return (
                <ListItem onTouchTap={()=>{
                    this.setState({selectedAdvisor: advisor})
                  }} key={advisor._id} primaryText={advisor.name} secondaryText={advisor._id}/>
              )
            })}
          </List>
        </div>
        <div className="right-panel" style={{margin: "0 16px"}}>
          <div className="light-card default-padding">
            <NewPublicAdvisorForm onSubmit={this.handleFormSubmit} initialValues={this.state.selectedAdvisor} enableReinitialize={true}></NewPublicAdvisorForm>
          </div>
        </div>
      </div>
    )
  }
}

const mapStatesToProps = (states) => {
  return {
    internal: states.internal,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(InternalActions, dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(ManagePublicInfoView);
