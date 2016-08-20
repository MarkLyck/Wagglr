import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'underscore';

import store from '../store';
import Nav from '../Components/Nav';

export default React.createClass({
  getInitialState: function() {
    return {
      session: store.session.get('username'),
      messages: store.messagesCollection.toJSON(),
      // myMessages: [],
      fetched: false,
    }
  },
  viewChatMessage: function(convoWith) {
    browserHistory.push(`/messages/${convoWith}`);
  },
  updateState: function() {
    this.setState({session: store.session.get('username')});
    this.setState({messages: store.messagesCollection.toJSON()});
    if (this.state.session && !this.state.fetched) {
      store.messagesCollection.findMyMessages(this.state.username);
      this.setState({fetched:true});
    }
  },
  componentDidMount: function() {
    store.messagesCollection.findMyMessages(this.state.session).then((response) => {
      this.setState({myMessages: response.toJSON() });
    });
    store.messagesCollection.on('change update', this.updateState);
    store.session.on('change', this.updateState);
  },
  componentWillUnmount: function() {
    store.session.off('change', this.updateState);
    store.messagesCollection.off('change update', this.updateState);
  },
  render: function() {
    let allMyConversations = [];

    let messagesArr = this.state.messages.filter((curr, i, arr) => {
      let convoWith = curr.sender;
      if (this.state.session === curr.sender) {
        convoWith = curr.recipient;
      }
      if (allMyConversations.indexOf(convoWith) === -1) {
        allMyConversations.push(convoWith);
        return true;
      }
    });

    // console.log(messagesArr);

    messagesArr = messagesArr.map((curr, i, arr) => {
      let convoWith = curr.sender;
      if (this.state.session === curr.sender) {
        convoWith = curr.recipient;
      }
      // console.log(curr);
      // console.log(curr.timestamp);
      // let mostRecentReply = _.sortBy(curr.timestamp);
      // console.log(mostRecentReply);
      let messagePreview = (
        <li key={i} onClick={this.viewChatMessage.bind(null, convoWith)}>
          <h2>{convoWith}</h2>
          <data>{curr.momentTime}</data>
        </li>
      );
      return messagePreview;
    });
    return (
      <div className="message-history-page-container">
        <Nav />
        <ul>
          {messagesArr}
        </ul>
      </div>
    );
  }
});
