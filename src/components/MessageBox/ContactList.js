import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';


class ContactList extends Component {
  render() {
    const contacts = this.props.contacts
    const contactsByIds = contacts.byIds
    const allIds = contacts.allIds
    // const hasMessage = targetContactId in messagesByContactIds
    // const userid = this.props.userId
    return (
      <List>
        <Subheader>Recent chats</Subheader>
        {allIds.map((contact_id) => {
          return (
            <ListItem
              key={contact_id}
              onClick={() => {this.props.contactOnChoose(contactsByIds[contact_id])}}
              primaryText={contactsByIds[contact_id].name}
              rightIcon={<CommunicationChatBubble />}
              />
          )
        })}

      </List>
    )
  }

}

export default ContactList;
