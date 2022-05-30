//const SimplePeer = require("simple-peer");

let isCalling = false;

let waitIgnoreCall = true;
const ignoreCallNow = 1;
const ignoreCallLong = 2;

let currentCaller = "";
let localStrem;
var answerPeer = new SimplePeer();
var callPeer;
const mediaConstraints = {
  audio: true,
  video: { width: 1280, height: 720 },
}
// FUNCTIONS ==================================================================

function showMediaConferent() {  
  document.getElementById("divVideoCall").style.display = "block";
}

function hideMediaConferent() {  
  document.getElementById("divVideoCall").style.display = "none";
}

function showLocalVideo() {  
  document.getElementById("divLocalVideo").style.display = "block";
}

function hideLocalVideo() {  
  document.getElementById("divLocalVideo").style.display = "none";
}

function showRemoteVideo(){
  document.getElementById("divRemoteVideo").style.display = "block";
}

function hideRemoteVideo(){
  document.getElementById("divRemoteVideo").style.display = "none";
}

function showCallFeedbackControl(){
  document.getElementById("divCallFeedbackControl").style.display = "block";
}

function hideCallFeedbackControl(){
  document.getElementById("divCallFeedbackControl").style.display = "none";
}

function showRemoteVideoControl(){
  document.getElementById("divRemoteVideoControl").style.display = "block";
}

function hideRemoteVideoControl(){
  document.getElementById("divRemoteVideoControl").style.display = "none";
}

//action function=========================================

function startPeerConnect(){
  socket.emit('ackUser', boxChatOf);   
}

socket.on('ackUserResult', function(userStatus){
  if(userStatus === onlineStatus){
    showMediaConferent();
    onMediaStream();
  }else{
    alert('this person do not online');
  }
});

socket.on('ackUserCome', function(userCall){
  friendInAlert = userCall;
  currentCaller = userCall;
  
  if(!isCalling){    
    singleAlertType = alertFriendCall;
    const alert = userCall + alertContents[singleAlertType];
    showCallAlert(alert);
  
  }else{
    userBusy(ignoreCallNow);
  }
  //alert(isCalling);
});

function showCallAlert(alert){
  showCallFeedbackControl();
  document.getElementById("aWhoCalling").textContent = alert;

  userBusy(ignoreCallLong);  
}

function callAccept(){
  //tell server i accept your call
  isCalling = true;
  callFeedback(callUserOk);
  showMediaConferent();
  hideCallFeedbackControl();

  showLocalVideo();
  onMediaStream();
}

function callFeedback( feedbackType){
  let feedbackObj = [];
  feedbackObj.push(currentCaller);
  feedbackObj.push(feedbackType);
  socket.emit('ackUserFeedBack', feedbackObj);
}

socket.on('ackUserFeedbackResult', function(answer){
  switch(answer){
    case callUserOk:
      onMediaStream(true);
    break;
    case callUserCancel:
      stopBothVideoAndAudio(localStrem);
      alert("The user cancel your call");
      hideMediaConferent();
    break;

    default:
      stopBothVideoAndAudio(localStrem);
      alert("The user do not pickup your call");
      hideMediaConferent();
  }
});

socket.on('webrtcOfferCome',  function(signalOffer){
  answerPeer.signal(JSON.parse(signalOffer));

  answerPeer.on('signal', function(data) {      
    const signalAnswer = JSON.stringify(data);

    let offerObj = [];
    offerObj.push(currentCaller);
    offerObj.push(signalAnswer);
    console.log(socket.username + " reply signalAnswer to " + currentCaller);
    socket.emit('webrtcAnswer', offerObj);
  });
});

socket.on('webrtcAnswerResult', function(signalAnswer){
  callPeer.signal(JSON.parse(signalAnswer));
  
  callPeer.on('connect', function(){  
    console.log('call connected');
    callPeer.send("Hello " + boxChatOf);
  });

  callPeer.on('data', data => {
    console.log('data: ' + data)
  });
  
  callPeer.on('stream', function(remotetream){        
    // got remote video stream, now let's show it in a video tag
    var video = document.getElementById('remoteVideo');
    
    video.srcObject = remotetream;
    showRemoteVideo();
  });
});

answerPeer.on('connect', function(){
  console.log('answer connected');
  answerPeer.send("Hello " + currentCaller)
});

answerPeer.on('data', data => {
  console.log('data: ' + data)
});

answerPeer.on('stream', function(remotetream){
  // got remote video stream, now let's show it in a video tag
  var video = document.getElementById('remoteVideo');
   
  video.srcObject = remotetream;
  showRemoteVideo();  
});


function peerConnect (stream) {
  //play local video
  const localVideo = document.getElementById("localVideo");
  localVideo.srcObject = stream;

  callPeer = new SimplePeer({ initiator: true, trickle: false, stream: stream }); 

  callPeer.on('signal', function(data){
    //get offer signal created by callPeer
    const signalOffer = (JSON.stringify(data));
    
    let offerObj = [];
    offerObj.push(boxChatOf);
    offerObj.push(signalOffer);

    socket.emit('startCall', offerObj); 
  });
}

function onMediaStream(isMakeCall){
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(mediaConstraints)
      .then(function (stream) {        
        if(isMakeCall){//make the call after friend accept my call          
          isCalling = true;
          peerConnect(stream);
        }else{ //open my camera to ready call
          //set global localStream to stop call
          localStrem = stream;
          //show localStream
          document.getElementById("localVideo").srcObject = localStrem; 

          if(currentCaller !== '')//get offer
            answerPeer.addStream(localStrem);
        }
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }  
}

function stopCall(){  
  endTheCall();
  stopBothVideoAndAudio(localStrem);
  hideMediaConferent();  
  singleCallReset();
}

function singleCallReset(){
  isCalling = false;
  waitIgnoreCall = true;
  currentCaller = "";
  localStrem = null;

  //document.getElementById("localVideo").srcObject = null;
  //document.getElementById("remoteVideo").srcObject = null;
}

function callCancel(){
  callFeedback(callUserCancel);
  hideCallFeedbackControl();
  waitIgnoreCall = false;
  isCalling = false;
}

// stop both mic and camera
function stopBothVideoAndAudio(stream) {
  stream.getTracks().forEach(function(track) {
      if (track.readyState == 'live') {
          track.stop();
      }
  });
}

// stop only camera
function stopVideoOnly(stream) {
  stream.getTracks().forEach(function(track) {
      if (track.readyState == 'live' && track.kind === 'video') {
          track.stop();
      }
  });
}

// stop only mic
function stopAudioOnly(stream) {
  stream.getTracks().forEach(function(track) {
      if (track.readyState == 'live' && track.kind === 'audio') {
          track.stop();
      }
  });
}

//-------------- stop the call ------------------------


function endTheCall(){
  let breakedUser = '';
  if(currentCaller){
    breakedUser = currentCaller;
    answerPeer.destroy();
    answerPeer = new SimplePeer();
  }else{    
    breakedUser = boxChatOf;
    callPeer.destroy();
    callPeer = new SimplePeer({initiator: true, trickle: false});
  }

  let endCallObj = [];
  endCallObj.push(breakedUser);
  endCallObj.push("date time here");
  socket.emit('endTheCall', endCallObj);
}

socket.on('endTheCallCome', function(endCallObj){
  breakedUser = endCallObj[0];
 // alert( breakedUser + ' stop call');
  if(currentCaller){
    answerPeer.destroy();    
  }else{
    callPeer.destroy();
  }

  stopBothVideoAndAudio(localStrem);
  hideMediaConferent();
  singleCallReset();
  
});


function callIgnore(){
  waitIgnoreCall = true;
  hideCallFeedbackControl();
}

function userBusy(type){  
  if(type === ignoreCallNow){
    callFeedback(callUserBusy);
    hideCallFeedbackControl();
  }else if ((type === ignoreCallLong)){
      setTimeout(() => {
        if(isCalling === false  && waitIgnoreCall === true){
          callFeedback(callUserBusy);
          hideCallFeedbackControl();
          waitIgnoreCall = true;
        }else{
          waitIgnoreCall = true;
        }
      }, 10000);     
  }
  else{
    //do nothing
  }  
}