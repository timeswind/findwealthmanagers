import React, { Component } from 'react';
import {push} from 'react-router-redux';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import {ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {connect} from 'react-redux';
import moment from 'moment';

class DashboardCalendarSection extends Component {
  render () {
    const { role, appointments, dispatch } = this.props
    return (
      <div>
        { role !== 1 && (
          <div className="flex-column light-shadow" style={{marginBottom: 8}}>
            <div className="flex-row flex-center">
              <div className="flex-column default-padding raleway"
                style={{fontSize: "22px", fontWeight: '600'}}>
                Calendar
              </div>
              <FlatButton
                label="manage"
                labelStyle={{color: "rgb(66, 133, 244)"}}
                onClick={() => {
                  dispatch(push('/dashboard/calendar'))
                }}
                />
            </div>
            <Divider />
            <div style={{padding: 0}}>
              <Subheader>Today's Plan</Subheader>
              <Divider />
              { appointments.map((appointment, index) => {
                return (
                  <div
                    key={appointment._id}>
                    { appointment.date === 'today' ? (
                      <ListItem
                        primaryText={
                          <div className="flex-row">
                            <span>{moment(appointment.start).format('h:mm a') + " - " + moment(appointment.end).format('h:mm a')}</span>
                            <span style={{
                                marginLeft: "auto",
                                color: "#ff9800"
                              }}>{appointment.client}</span>
                            </div>
                          }
                          secondaryText={
                            appointment.note !== "" ? (
                              <p>
                                {appointment.note}
                              </p>
                            ) : null
                          }
                          />
                      ) : (
                        <div>
                          { index === 0 ? (
                            <ListItem
                              primaryText="No appointment"
                              />
                          ) : null}
                          { index > 0 && appointments[index].day === appointments[index - 1].day ? null : (
                            <div>
                              <Divider />
                              <Subheader>{moment(appointment.date).format('MMM DD')}</Subheader>
                              <Divider />
                            </div>
                          ) }
                          <ListItem
                            primaryText={
                              <div className="flex-column">
                                <div className="flex-row">
                                  <span>{moment(appointment.start).format('h:mm a') + " - " + moment(appointment.end).format('h:mm a')}</span>
                                  <span style={{
                                      marginLeft: "auto",
                                      color: "#ff9800"
                                    }}>{appointment.client}</span>
                                  </div>
                                </div>
                              }
                              secondaryText={
                                appointment.note !== "" ? (
                                  <p>
                                    {appointment.note}
                                  </p>
                                ) : null
                              }
                              />
                          </div>
                        ) }
                      </div>
                    )
                  }) }
                </div>
              </div>
            )}
          </div>
        )
      }
    }
    export default connect()(DashboardCalendarSection);
