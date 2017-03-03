import React, {Component} from 'react';
import { ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader'
import moment from 'moment'
import { connect } from 'react-redux';
import * as ClientbookActions from '../../redux/actions/clientbook';
import { bindActionCreators } from 'redux';
import FlatButton from 'material-ui/FlatButton';


class ClientbookAppointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingAppointments: [],
      passedAppointments: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.modifyAppointments(nextProps.appointments)
    //  if (nextProps.currentValue !== this.props.currentValue) {
    //    this.setState({addressInput: nextProps.currentValue})
    //  }
  }

  modifyAppointments(appointments) {
    if (appointments.length > 0) {
      var upcomingAppointments = []
      var passedAppointments = []
      let today = new Date()
      appointments.forEach((appointment) => {
        if (today.getTime() > new Date(appointment.start).getTime()) {
          passedAppointments.push(appointment)
        } else {
          upcomingAppointments.push(appointment)
        }
      })
      this.setState({upcomingAppointments, passedAppointments})
    } else {
      this.setState({upcomingAppointments: [], passedAppointments: []})
    }
  }

  handleAddAppointmentModalOpen = () => {
    const { actions } = this.props
    actions.setClientbookAddAppointmentModalStatus(true)
  };

  render() {
    const { passedAppointments, upcomingAppointments } = this.state
    const { style, wrapperClass} = this.props
    return (
      <div className={wrapperClass} style={style}>
        {upcomingAppointments.length > 0 && (<Subheader>Upcoming Appointments</Subheader>)}
        {upcomingAppointments.map((appointment, index)=>{
          return (
            <ListItem
              key={index}
              primaryText={
                <div style={{margin: 0}} className="flex-row">
                  <span style={{backgroundColor: "#304966", height: 31, width: 36, padding: 8, color: "#fff", borderRadius: 3}}>{moment(appointment.date).format('MMM DD')} </span>
                  <div style={{marginLeft: "auto"}} className="flex-column align-right">
                    <span>{moment(appointment.start).format('h:mm a') + " - " + moment(appointment.end).format('h:mm a')}</span>
                    {
                      appointment.note !== "" ? (
                        <p style={{color:"#666"}}>
                          {appointment.note}
                        </p>
                      ): null
                    }
                  </div>
                </div>
              }
              />
          )
        })}
        {passedAppointments.length > 0 && (<Subheader>Passed Appointments</Subheader>)}
        {passedAppointments.map((appointment, index)=>{
          return (
            <ListItem
              key={index}
              primaryText={
                <div style={{margin: 0}} className="flex-row">
                  <span style={{backgroundColor: "#304966", height: 31, width: 36, padding: 8, color: "#fff", borderRadius: 3}}>{moment(appointment.date).format('MMM DD')} </span>
                  <div style={{marginLeft: "auto"}} className="flex-column align-right">
                    <span>{moment(appointment.start).format('h:mm a') + " - " + moment(appointment.end).format('h:mm a')}</span>
                    {
                      appointment.note !== "" ? (
                        <p style={{color:"#666"}}>
                          {appointment.note}
                        </p>
                      ): null
                    }
                  </div>
                </div>
              }
              />
          )
        })}
        <FlatButton label="Add appointment" style={{margin: "0 16px"}} backgroundColor="#e7e7e7" onTouchTap={this.handleAddAppointmentModalOpen}/>
      </div>
    );
  }
}

ClientbookAppointments.defaultProps = {
  appointments: []
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ClientbookActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(ClientbookAppointments);
