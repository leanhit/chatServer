function showChatList() {
  isChatWithGuest = false;
  let body = document.getElementById("ulChatlistView");
  body.innerHTML = "";
  refreshData();
}


function showGuestList() {
  isChatWithGuest = true;
  let body = document.getElementById("ulChatlistView");
  body.innerHTML = "";

  getGuestsList();
}


function getGuestsList() {
  setTimeout(function () {
    socket.emit("getGuestsList");
  }, 500);
}

socket.on("getGuestsListResult", (data) => {
  //copy data to myChatList
  myListChat = data;
  console.log(myListChat)

  setupSidebarFrame();
  setupStartFrame();

  clearTableChatList();
  createTableChatlist(myListChat);

});

function showGuestMessage(mess) {

  var userSend = mess.sender;
  var messageTo = mess.userGetMess;

  var body = document.getElementById("messages");
  //set position of form        
  if (socket.username == userSend) {//yourselt
    //create table of mess
    addMessage(body, mess, "right");

  } else{//guest mess

    //create table chat list
    addMessage(body, mess, "left");
  }
}

socket.on("guestMessage", (msg)=>{
  //check resource of message
  //view mess to window
  addaMessToWindow(msg);
})