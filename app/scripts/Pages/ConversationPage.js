import React from 'react';

import store from '../store';
import Nav from '../Components/Nav';

export default React.createClass({
  getInitialState: function() {
    return {
      session: store.session.get('username'),
      messages: store.messagesCollection.toJSON(),
      conversation: store.messagesCollection.findConversation(this.props.params.recipient),
      newMessage: [],
      fetched: false,
    }
  },
  sendMessage: function(e) {
    e.preventDefault();
    let sentMessage = this.refs.textbox.value;
    console.log(sentMessage);
    // console.log(this.state.conversation);
    store.messagesCollection.sendMessage(store.session.get('username'), sentMessage);
  },
  updateState: function() {
    this.setState({conversation:store.messagesCollection.findConversation(this.props.params.recipient)});
    this.setState({session:store.session.get('username')});

    if (this.state.session && !this.state.fetched) {
      // this.setState({fetched:true});
      store.messagesCollection.findMyMessages(this.state.username);
      this.setState({fetched:true});
    }
  },
  componentDidMount: function() {

    store.session.on('change', this.updateState);
    store.messagesCollection.on('change update', this.updateState);
  },
  componentWillUnmount: function() {
    store.session.off('change', this.updateState);
    store.messagesCollection.off('change update', this.updateState);
  },
  render: function() {
    let convo = this.state.conversation.map((curr, i, arr) => {
      curr = curr.toJSON();
      console.log(curr);
      let whoSent = whoSent = 'not-me';;
      if (this.state.session === curr.sender) {
        whoSent = 'me';
      }
      let content = (
        <li key={i} className={whoSent}>
          <p className="message-body">{curr.body}</p>
        </li>
      );
      return content;
    });
    // console.log(this.state);
    // let convo = this.state.conversation.attributes;
    // console.log(this.state.conversation.toJSON());
    // if (this.state.conversation.attributes) {
      // console.log(this.state.conversation.attributes);
    // }
    return (
      <div className="message-page-container">
        <Nav/>
        <h2>{this.props.params.recipient}</h2>
        <ul className="messages-container">
          {convo}
        </ul>
        <form className="chat-form-container" onSubmit={this.sendMessage}>
          <input type="text" role="textbox" tabIndex="1" ref="textbox" />
          <input className="submit-btn" type="submit" role="button" tabIndex="2" />
          <button onClick={this.sendMessage}>send</button>
        </form>
      </div>
    );
  }
});
