import { UserAgent } from '@apirtc/apirtc';
import React, { useState, useRef } from 'react';

export default function ConversationComponent() {

  const conversationRef = useRef(null);
  const [conversationName, setConversationName] = useState("")

  //streamListchanged: subscribe to new remote stream published in the conversation and get future events triggered by this stream
  const onStreamListChangedHandler = function (streamInfo) {
    if (streamInfo.listEventType === 'added' && streamInfo.isRemote) {

      if (conversationRef.current)
        conversationRef.current.subscribeToStream(streamInfo.streamId)
          .then((stream) => {
            console.log('subscribeToStream success', streamInfo);
          }).catch((err) => {
            console.error('subscribeToStream error', err);
          });
    }
  }

  //streamAdded: Display the newly added stream
  const onStreamAddedHandler = function (stream) {
    if (stream.isRemote) {
      stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);
    }
  }

  //streamRemoved: Remove the participant's display from the UI
  const onStreamRemovedHandler = function (stream) {
    if (stream.isRemote) {
      stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId)
    }
  }

  const startConversation = function () {
    var localStream = null;

    /**
     * Get your free account on https://cloud.apirtc.com/ 
     * and replace the value below with your own apikey value 
     * to be found at https://cloud.apirtc.com/enterprise/api
     */

    const apikey = "myDemoApiKey" //"#YOUR_OWN_API_KEY#"

    //Configure the User Agent using the apikey.
    const ua = new UserAgent({
      uri: 'apiKey:' + apikey
    })

    //Connect the UserAgent and get a session
    ua.register().then((session) => {

      const conversationName = "CONVERSATION_NAME"

      const conversation = session.getOrCreateConversation(conversationName, { meshOnlyEnabled: true })

      setConversationName(conversation.getName())

      conversationRef.current = conversation

      conversation.on("streamListChanged", onStreamListChangedHandler)
      conversation.on("streamAdded", onStreamAddedHandler)
      conversation.on("streamRemoved", onStreamRemovedHandler)

      //Instantiate a local video stream object
      ua.createStream({
        constraints: {
          audio: true,
          video: true
        }
      })
        .then((stream) => {

          // Save local stream in a constiable accessible to eventhandlers
          localStream = stream;

          //Display the local video stream
          stream.attachToElement(document.getElementById('local-video-stream'));
          document.getElementById('local-stream-id').innerHTML = ua.getUsername()


          //Join the conversation
          conversation.join()
            .then((response) => {

              conversation
                .publish(localStream)
                .then((stream) => {
                  console.log("Your local stream is published in the conversation", stream);
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

  return (
    <div>
      <div>
         <button id="startConversation" onClick={startConversation}>Start Conversation</button>
      </div>
      <div>
        <p>Conversation Name: <span id="conversationNameLabel">{conversationName}</span></p>
      </div>
      <div>
        <h2>Remote videos</h2>
        <div id="remote-container">
          {/* <!-- This is where the remote video streams will be added --> */}
        </div>
        <div id="local-container">
          <h2>Local video</h2>
          <p><span id="local-stream-id"></span></p>
          {/* <!-- This is where we are going to display our local video stream --> */}
          <video id="local-video-stream" autoPlay muted></video>
        </div>
      </div>
    </div>)
}
