import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ChatBubble from './ChatBubble';

class MessageList extends Component {

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    this.scrollToBottom()
  }

  scrollToBottom = () => {
    console.log('scrollToBottom')
    const node = ReactDOM.findDOMNode(this.refs.test);
    node.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const targetContactId = this.props.contactId
    const messagesByContactIds = this.props.messages.byContactIds
    const hasMessage = targetContactId in messagesByContactIds
    const userid = this.props.userId

    return (
      <div className='message-list'>
        { hasMessage ? (
          <div>
            {
              messagesByContactIds[targetContactId].map(function(message, index) {
                const isResponse = message.to !== userid
                return (
                  <ChatBubble key={`${index}`} message={message} isResponse={isResponse} fromName="fromName"/>
                );
              })
            }
          </div>
        ) : (<div>no messages</div>) }
        <div style={{ float:"left", height: "64px" }}
          ref="test" />
      </div>
    )
  }

}

export default MessageList;
