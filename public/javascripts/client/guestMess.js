function showChatList() {
  isChatWithGuest = false;
  let body = document.getElementById("ulChatlistView");
  body.innerHTML = "";
  selectTab(1);
  refreshData();
}


function showGuestList() {
  isChatWithGuest = true;
  let body = document.getElementById("ulChatlistView");
  body.innerHTML = "";
  selectTab(0);
  getGuestsList();
}

function selectTab(index) {
  let elementArray = document.getElementsByClassName("tabListChater");
  
  for (var i = 0; i < elementArray.length; i++) {
    elementArray[i].style.color = 'black';
    if (index == i) {
      elementArray[i].style.color = 'blue';
    }
  }
}

function getGuestsList() {
  setTimeout(function () {
    socket.emit("getGuestsList");
  }, 500);
}

socket.on("getGuestsListResult", (data) => {
  console.log(myListChat)
  //copy data to myChatList
  myListChat = data;
  
  setupSidebarFrame();
  setupStartFrame();

  clearTableChatList();
  createTableChatlist(myListChat);

});

function showGuestMessage(mess) {

  var userSend = mess.sender;
  var body = document.getElementById("messages");
  //set position of form        
  if (socket.username == userSend) {//yourselt
    //create table of mess
    addMessage(body, mess, "right");

  } else {//guest mess

    //create table chat list
    addMessage(body, mess, "left");
  }
}

socket.on("guestMessage", (msg) => {
  //check resource of message
  //view mess to window
  addaMessToWindow(msg);
})