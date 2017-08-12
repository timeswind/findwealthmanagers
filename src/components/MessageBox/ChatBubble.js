import React, {Component} from 'react';

const chatBubbleStyle = {
  backgroundColor: "#fff",
  padding: "8px 16px",
  borderBottom: "1px solid #ddd"
}

const chatBubbleNameLabelStyle = {
  fontSize: "13px",
  fontWeight: "Bold",
  color: "#999"
}

const chatBubbleNameLabelResponseStyle = {
  fontSize: "13px",
  fontWeight: "Bold",
  color: "#999",
  alignSelf: "flex-end"
}

const messageBodyStyle = {
  margin: "0",
  textAlign: "left",
  overflow: "auto"
}

const messageBodyResponseStyle = {
  margin: "0",
  textAlign: "right",
  overflow: "auto"
}


class ChatBubble extends Component {
  render() {
    const message = this.props.message
    const isResponse = this.props.isResponse
    const fromName = this.props.fromName
    return (
      <div className="flex-column" style={chatBubbleStyle}>
        <span style={isResponse ? chatBubbleNameLabelResponseStyle : chatBubbleNameLabelStyle}>{fromName}</span>
        <p style={isResponse ? messageBodyResponseStyle : messageBodyStyle}>{message.body}</p>
      </div>
    )
  }

}

export default ChatBubble;
