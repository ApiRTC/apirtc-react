(this["webpackJsonpapirtc-react"]=this["webpackJsonpapirtc-react"]||[]).push([[0],{14:function(e,t,n){},15:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var o=n(1),r=n.n(o),a=n(4),i=n.n(a),c=(n(14),n(5)),s=n(6),l=n(2),d=n(9),u=n(8),h=(n(15),n(7)),m=n(0),v=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).state={name:"",conversation:null},o.handleNameChange=o.handleNameChange.bind(Object(l.a)(o)),o.getOrCreateConversation=o.getOrCreateConversation.bind(Object(l.a)(o)),o}return Object(s.a)(n,[{key:"handleNameChange",value:function(e){this.setState({name:e.target.value})}},{key:"getOrCreateConversation",value:function(e){var t=this;console.log("getOrCreateConversation",e),e.preventDefault();var n=null,o=new h.UserAgent({uri:"apzkey:myDemoApiKey"});o.register().then((function(e){var r=e.getConversation(t.state.name);t.setState({conversation:r}),r.on("streamListChanged",(function(e){console.log("streamListChanged :",e),"added"===e.listEventType&&!0===e.isRemote&&r.subscribeToMedia(e.streamId).then((function(e){console.log("subscribeToMedia success")})).catch((function(e){console.error("subscribeToMedia error",e)}))})),r.on("streamAdded",(function(e){e.addInDiv("remote-container","remote-media-"+e.streamId,{},!1)})).on("streamRemoved",(function(e){e.removeFromDiv("remote-container","remote-media-"+e.streamId)})),o.createStream({constraints:{audio:!0,video:!0}}).then((function(e){console.log("createStream :",e),n=e,e.removeFromDiv("local-container","local-media"),e.addInDiv("local-container","local-media",{},!0),r.join().then((function(e){r.publish(n).then((function(e){console.log("published",e)})).catch((function(e){console.error("publish error",e)}))})).catch((function(e){console.error("Conversation join error",e)}))})).catch((function(e){console.error("create stream error",e)}))}))}},{key:"render",value:function(){var e=null!==this.state.conversation;return Object(m.jsx)("div",{children:e?Object(m.jsxs)("div",{children:[Object(m.jsx)("div",{id:"remote-container"}),Object(m.jsx)("div",{id:"local-container"})]}):Object(m.jsxs)("form",{onSubmit:this.getOrCreateConversation,children:[Object(m.jsx)("input",{type:"text",placeholder:"abcd",value:this.state.name,onChange:this.handleNameChange})," \xa0",Object(m.jsx)("button",{type:"submit",title:"Get Or Create Conversation",children:"GetOrCreateConversation"})]})})}}]),n}(r.a.Component);var b=function(){return Object(m.jsxs)("div",{className:"App",children:[Object(m.jsxs)("p",{children:[Object(m.jsx)("img",{alt:"ApiRTC logo",src:"/ApiRTC.png",width:"66",height:"76"}),"\xa0&\xa0",Object(m.jsx)("img",{alt:"React logo",src:"/logo192.png",width:"76",height:"76"})]}),Object(m.jsx)(v,{})]})},g=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,18)).then((function(t){var n=t.getCLS,o=t.getFID,r=t.getFCP,a=t.getLCP,i=t.getTTFB;n(e),o(e),r(e),a(e),i(e)}))};i.a.render(Object(m.jsx)(r.a.StrictMode,{children:Object(m.jsx)(b,{})}),document.getElementById("root")),g()}},[[17,1,2]]]);
//# sourceMappingURL=main.f912e022.chunk.js.map