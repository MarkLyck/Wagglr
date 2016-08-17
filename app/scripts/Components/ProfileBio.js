import React from 'react';

import store from '../store';

export default React.createClass({
  getInitialState: function() {
    return {
      editing: store.session.get('isEditing'),
    }
  },
  saveEdits: function(e) {
    e.preventDefault();
    let newUserName = this.refs.userInfoName.value;
    let newUserAge = this.refs.userInfoAge.value;
    let newDogName = this.refs.dogInfoName.value;
    let newDogAge = this.refs.dogInfoAge.value;
    let newDogBreed = this.refs.dogInfoBreed.value;
    // let newLocationInfo = this.refs.locationInfo.value;
    let newAboutInfo = this.refs.aboutInfo.value;
    store.session.updateProfile(newUserName, newUserAge, newDogName, newDogAge, newDogBreed, newAboutInfo);
    store.session.set('isEditing', false);
  },
  updateState: function() {
    this.setState({editing: store.session.get('isEditing')});
    console.log('updateState state', this.state.editing);
  },
  componentDidMount: function() {
    console.log('componentDidMount state', this.state.editing);
    this.setState({editing: store.session.get('isEditing')});
    store.session.on('change', this.updateState);
  },
  componentWillUnmount: function() {
    store.session.off('change', this.updateState);
  },
  render: function() {
    // console.log(this.state.editing);
    let content;
    if (!this.state.editing) {
      // console.log(store.session.get('usersName'));
      console.log(this.props.user);
      content =(
        <div>
          <form className="profile-about-data">
            <ul className="ul-about-data">
              <li>{this.props.user.profile.usersName} {this.props.user.profile.usersAge}</li>
              <li>{this.props.user.dog.dogName} {this.props.user.dog.dogAge}</li>
              <li>Austin, 3 miles away</li>
            </ul>

            <p className="about-bio">
              {this.props.user.profile.bio}
            </p>
          </form>
        </div>
      );
    } else if (this.state.editing) {
        content = (
          <div>
            <form className="profile-about-data" onSubmit={this.saveEdits}>
              <ul className="ul-about-data">
                <li>
                  <label>user's name</label><input type="text" defaultValue={this.props.user.profile.usersName} tabIndex="1" role="textbox" ref="userInfoName" />
                  <label>user's age</label><input type="text" defaultValue={this.props.user.profile.usersAge} tabIndex="2" role="textbox" ref="userInfoAge" />
                </li>
                <li>
                  <label>dog name</label><input type="text" defaultValue={this.props.user.dog.dogName} tabIndex="3" role="textbox" ref="dogInfoName" />
                  <label>dog age</label><input type="text" defaultValue={this.props.user.dog.dogAge} tabIndex="4" role="textbox" ref="dogInfoAge" />
                  <label>dog breed</label><input type="text" defaultValue={this.props.user.dog.dogBreed} tabIndex="5" role="textbox" ref="dogInfoBreed" />
                </li>
              </ul>
              <textarea  className="about-bio" defaultValue={this.props.user.profile.bio} tabIndex="6" role="textbox" ref="aboutInfo" />

              <input type="submit" value="submit" role="button" />
              <button onClick={this.saveEdits} tabIndex="7">done</button>
            </form>
          </div>
      );

    }
    return (
      <main className="profile-main">
        {content}
      </main>
    );

  }
});
