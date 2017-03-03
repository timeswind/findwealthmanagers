import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import TimePicker from 'material-ui/TimePicker';
import { TimeToIndex } from '../../core/TimeToIndex';

class CalendarEditFreetime extends Component {
  state = {
    changed: false,
    startTime: null,
    endTime: null
  }
  ondeleteHandler () {
    if (typeof this.props.ondelete === 'function') {
      this.props.ondelete()
    }
  }

  onupdateHandler () {
    if (typeof this.props.onupdate === 'function') {
      this.props.onupdate(this.state.startTime, this.state.endTime)
    }
  }

  handleChangeTimePickerStart = (event, date) => {
    let startTimeInNumber = TimeToIndex(date)
    var endTimeInNumber
    if (this.state.endTime === null) {
      endTimeInNumber = TimeToIndex(this.props.end)
    } else {
      endTimeInNumber = this.state.endTime
    }
    this.setState({changed: true, startTime: startTimeInNumber, endTime: endTimeInNumber});
  };

  handleChangeTimePickerEnd = (event, date) => {
    var startTimeInNumber
    let endTimeInNumber = TimeToIndex(date)
    if (this.state.startTime === null) {
      startTimeInNumber = TimeToIndex(this.props.start)
    } else {
      startTimeInNumber = this.state.startTime
    }
    this.setState({changed: true, startTime: startTimeInNumber, endTime: endTimeInNumber});
  };

  render () {
    const { start, end } = this.props
    return (
      <div>

        <TimePicker
          format="ampm"
          hintText="Pick Start Time"
          value={start}
          onChange={this.handleChangeTimePickerStart}
          />
        <TimePicker
          format="ampm"
          hintText="Pick End Time"
          value={end}
          onChange={this.handleChangeTimePickerEnd}
          />
        <FlatButton label="Delete" secondary={true} onTouchTap={() => this.ondeleteHandler()}/>
        { this.state.changed && (<FlatButton label="Update" secondary={false} onTouchTap={() => this.onupdateHandler()}/>) }
      </div>
    )
  }
}
export default CalendarEditFreetime;
