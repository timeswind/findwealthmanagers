import React, {Component} from 'react';
import {TextField} from 'material-ui';

class MessageTextField extends Component {
  state = {
    currentMessage: ''
  }

  _handleCurrentMessafeTextFieldChange = (e) => {
    this.setState({currentMessage: e.target.value})
  }

  _handleMessageSend = (ev) => {
    if (ev.key === 'Enter' && this.state.currentMessage !== '') {
      this.props.sendMessage(this.state.currentMessage)
      this.setState({currentMessage: ''})
    }
  }

  render() {

    return (
      <div className="message_textfield">
        <TextField
          hintText="Enter message"
          value={this.state.currentMessage}
          onChange={this._handleCurrentMessafeTextFieldChange}
          onKeyPress={this._handleMessageSend}
          />
      </div>
    )
  }

}

export default MessageTextField;
