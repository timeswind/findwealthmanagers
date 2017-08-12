import React, { Component } from 'react';
import { FontIcon, TextField, RaisedButton } from 'material-ui';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import MessageList from './MessageList';
import MessageTextField from './MessageTextField';
import ContactList from './ContactList';
import * as ViewActions from '../../redux/actions/view';
import * as AuthActions from '../../redux/actions/auth';
import * as MessageActions from '../../redux/actions/message';

import './MessageBox.css';

class MessageBox extends Component {
  state = {
    email: '',
    name: '',
    currentMessage: '',
    email_warn: false
  }

  toggleMessageBox() {
    const { actions, messagebox } = this.props
    actions.setViewMessageboxStatus(!messagebox)
  }

  inputInfoAndStartChat = (e) => {
    const { actions } = this.props
    if (!this.state.email_warn) {
      actions.setName(this.state.name)
      actions.setEmail(this.state.email)
    }
  }

  _handleEmailTextFieldChange = (e) => {
    var update = {email: e.target.value, email_warn: true}
    /*eslint-disable */
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    /*eslint-enable */
    if (re.test(this.state.email)) {
      update.email_warn = false
    }
    this.setState(update)
  }

  _handleShowContactList = (e) => {
    this.props.actions.chooseChatObject(null)
  }

  _handleNameTextFieldChange = (e) => {
    this.setState({name: e.target.value})
  }

  sendMessage = (messageBody) => {
    console.log('messageBody', messageBody)
    const { userid, username, message } = this.props
    const newMessage = {
      'from': userid,
      'fromName': username,
      'to': message.currentTalkUser.userid,
      'body': messageBody,
      'date': new Date()
    }
    this.props.actions.sendNewMessage(newMessage)
  }

  contactOnChoose = (contact) => {
    const {actions} = this.props
    const user = {
      name: contact.name,
      userid: contact.id
    }
    actions.chooseChatObject(user)
  }

  render() {
    const { email, name, currentMessage, email_warn } = this.state
    const { messagebox, isLoginUser, userid, message} = this.props
    const meessageBoxClassName = messagebox ? "show" : "hide"
    return (
      <div id="message_box" className={meessageBoxClassName} ref="messagebox">
        <div className="box_header">
          { (message.currentTalkUser.userid !== '' && messagebox) && (<FontIcon className="material-icons hide-button" color="#ffffff" onClick={()=>{this._handleShowContactList()}}>keyboard_arrow_left</FontIcon>) }

          <span className="header-text"  onClick={()=>{this.toggleMessageBox()}}>
            {message.currentTalkUser.name !== '' ? message.currentTalkUser.name : 'Chat'}
          </span>
          <FontIcon className="material-icons hide-button" color="#ffffff"  onClick={()=>{this.toggleMessageBox()}}>remove</FontIcon>
        </div>
        { isLoginUser
          ? (
            <div style={{height: "100%"}}>
              {message.currentTalkUser.userid !== '' ? (
                <div className="content">
                  <MessageList
                    userId={userid}
                    contactId={message.currentTalkUser.userid}
                    messages={message.messages}
                    />
                  <MessageTextField
                    sendMessage={this.sendMessage}
                    />
                </div>
              ) : (
                <div>
                  <ContactList contacts={message.contacts} contactOnChoose={this.contactOnChoose}></ContactList>
                </div>
              )}
            </div>
          )
          : (
            <div className="flex-column align-center info_input">
              <TextField
                floatingLabelText="Enter your email"
                value={email}
                onChange={this._handleEmailTextFieldChange}
                errorText={email_warn && "Incorrect Email Address"}
                />

              <TextField
                floatingLabelText="Enter your name"
                value={name}
                onChange={this._handleNameTextFieldChange}
                />
              <RaisedButton
                className="start_chat"
                label="Chat now"
                primary={true}
                onClick={this.inputInfoAndStartChat}
                />
            </div>
          )
        }
        <div>
        </div>
      </div>
    );
  }
}

MessageBox.defaultProps = {
  // height: "200px",
  // width: "100%",
  // zoom: 4
};

MessageBox.propTypes = {
  // height: PropTypes.string,
  // width: PropTypes.string,
  // zoom: PropTypes.number,
  // markerPosition: PropTypes.object
};

const mapStatesToProps = (states) => {
  return {
    userid: states.auth.id,
    username: states.auth.name,
    messagebox: states.view.messagebox,
    message: states.message,
    isLoginUser: states.auth.email !== ''
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, ViewActions, AuthActions, MessageActions), dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(MessageBox);
