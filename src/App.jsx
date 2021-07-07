import './App.css';

import React from 'react';

import { UserAgent } from '@apizee/apirtc';

class Conversation extends React.Component {

  constructor(props) {
    super(props);
    this.state = { name: '', conversation: null };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.getOrCreateConversation = this.getOrCreateConversation.bind(this);
  }

  handleNameChange(event) { this.setState({ name: event.target.value }); }

  getOrCreateConversation(event) {
    console.log("getOrCreateConversation", event);
    event.preventDefault();

    var localStream = null;

    //==============================
    // 1/ CREATE USER AGENT
    //==============================
    var ua = new UserAgent({
      uri: 'apzkey:myDemoApiKey'
    });

    //==============================
    // 2/ REGISTER
    //==============================
    ua.register().then((session) => {

      //==============================
      // 3/ CREATE CONVERSATION
      //==============================
      const conversation = session.getConversation(this.state.name);
      this.setState({ conversation: conversation });

      //==========================================================
      // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
      //==========================================================
      conversation.on('streamListChanged', (streamInfo) => {
        console.log("streamListChanged :", streamInfo);
        if (streamInfo.listEventType === 'added') {
          if (streamInfo.isRemote === true) {
            conversation.subscribeToMedia(streamInfo.streamId)
              .then((stream) => {
                console.log('subscribeToMedia success');
              }).catch((err) => {
                console.error('subscribeToMedia error', err);
              });
          }
        }
      });
      //=====================================================
      // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM IS ADDED/REMOVED TO/FROM THE CONVERSATION
      //=====================================================
      conversation.on('streamAdded', (stream) => {
        stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);
      }).on('streamRemoved', (stream) => {
        stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
      });

      //==============================
      // 5/ CREATE LOCAL STREAM
      //==============================
      ua.createStream({
        constraints: {
          audio: true,
          video: true
        }
      })
        .then((stream) => {

          console.log('createStream :', stream);

          // Save local stream
          localStream = stream;
          stream.removeFromDiv('local-container', 'local-media');
          stream.addInDiv('local-container', 'local-media', {}, true);

          //==============================
          // 6/ JOIN CONVERSATION
          //==============================
          conversation.join()
            .then((response) => {
              //==============================
              // 7/ PUBLISH LOCAL STREAM
              //==============================
              conversation
                .publish(localStream)
                .then((stream) => {
                  console.log("published", stream);
                })
                .catch((err) => {
                  console.error("publish error", err);
                });
            }).catch((err) => {
              console.error('Conversation join error', err);
            });

        }).catch((err) => {
          console.error('create stream error', err);
        });

    });
  }

  render() {
    const hasConversation = this.state.conversation !== null;
    return (
      <div>
        {!hasConversation ?
          <form onSubmit={this.getOrCreateConversation} >
            <input type="text" placeholder="abcd" value={this.state.name} onChange={this.handleNameChange} /> &nbsp;
            <button type="submit" title="Get Or Create Conversation">GetOrCreateConversation</button>
          </form>
          :
          <div>
            <div id="remote-container">
            </div>
            <div id="local-container">
            </div>
          </div>
        }
      </div>)
  }
}

function App() {

  return (
    <div className="App">
      <p>
        <img alt="ApiRTC logo" src={process.env.PUBLIC_URL + '/ApiRTC.png'} width="66" height="76" />&nbsp;&&nbsp;
        <img alt="React logo" src={process.env.PUBLIC_URL + '/logo192.png'} width="76" height="76" />
      </p>
      <Conversation></Conversation>
    </div>
  );
}

export default App;
