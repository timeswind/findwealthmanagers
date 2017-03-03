import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import TimePicker from 'material-ui/TimePicker';

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
    this.setState({changed: true, startTime: date});
  };

  handleChangeTimePickerEnd = (event, date) => {
    this.setState({changed: true, endTime: date});
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
