//const { maxUsernameLength } = require("../server/defineValue");

function setupSidebarFrame() {
  document.getElementById("aSidebarMyName").textContent = socket.username;
  document.getElementById("imgSidebarMyAvatar").src = getAvatarPathView(socket.username);
}

function sidebarShowMenu() {
  document.getElementById("divSidebarMenu").style.display = "block";

  setTimeout(function () {
    document.getElementById("divSidebarMenu").style.display = "none";
  }, 4000);
}

function sidebarHideMenu() {
  document.getElementById("divSidebarMenu").style.display = "none";
}


function logoutClick() {
  deleteCookie("jwtoken");
  openPage('/');
}

socket.on('getChatListResult', function (data) {
  //copy data to myChatList
  myListChat = data;

  setupSidebarFrame();
  setupStartFrame();

  clearTableChatList();
  createTableChatlist(myListChat);
});

socket.on('getRoomsListResult', function (data) {
  myListRooms = data;
});

function clearTableChatList() {
  var chatlistView = document.getElementById("ulChatlistView");

  chatlistView.innerHTML = "";
}

//array store cell of name user . 
var listCellName = [];
//array store cell of user status
var listCellStatus = [];
function createTableChatlist(inputList) {
  listCellStatus = [];
  listCellName = [];
  var chatterNumber = inputList.length;
  var body = document.getElementById('ulChatlistView');
  var tbl = addTbl("100%", null);

  var tbdy = document.createElement('tbody');
  for (var i = 0; i < chatterNumber; i++) {
    //create row
    var tr = document.createElement('tr');
    const aChatter = inputList[i];

    //create status cell      ---------------------------------------  
    addImgCell(tr, aChatter.userStatus, sizeImgStatus);

    //create avatar cell -------------------------------------------------
    addImgCell(tr, aChatter.nameID, sizeImgAvatar);

    //create username cell ---------------------------------------------
    var tdUser = document.createElement('td');
    tdUser.appendChild(document.createTextNode(aChatter.realName));

    listCellName.push(tdUser);
    reflectFunction(tdUser, aChatter.nameID);
    //add cell to row  
    tr.appendChild(tdUser);
    //add tr to tbdy
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
  $('#ulChatlistView').animate({ scrollTop: $('#ulChatlistView').prop("scrollHeight") }, 500);

}

//change color of cell selected and call selectUser() function
function reflectFunction(tdName, userID) {
  //set numberOfMessagePage = 0 to count number of message page to read more
  numberOfMessagePage = 1;

  tdName.addEventListener('click', clickEle);
  function clickEle() {
    listCellName.forEach(td => {
      td.style.backgroundColor = 'paleturquoise';
    });

    tdName.style.backgroundColor = '#3807';
    selectUser(userID);
  }
}


socket.on('friendStatusResult', function (data) {
  var friendName = data[0];
  var friendStatus = data[1];

  if (listCellStatus.length) {
    for (var i = 0; i < listCellStatus.length; i++) {
      if (listCellName[i].textContent == friendName) {
        //reset status icon of friend

        listCellStatus[i].src = getStatusIcon(friendStatus);
      }
    }

  }

  var singleAlert = '';
  if (friendStatus === offlineStatus) {
    singleAlert = friendName + " is offline";

    //friend off while calling you
    if ((friendName === boxChatOf || friendName === currentCaller) && isCalling) {
      hideMediaConferent();
      stopBothVideoAndAudio(localStrem);
      singleCallReset();
    }
  } else {
    singleAlert = friendName + " is online";
  }

  friendInAlert = data[0];
  singleAlertType = alertFriendStatus;
  showSingleAlert(singleAlert);


});

//-----------------------------------------------------------------------


function showFriendToChoice() {
  var body = document.getElementById('ulChoiceFriend');
  var tbl = addTbl();

  var tbdy = document.createElement('tbody');
  myListChat.forEach(aChatter => {
    //create row
    var tr = document.createElement('tr');
    const usname = aChatter.nameID;

    if (usname.length <= maxUsernameLength && usname != "chatbot") {
      //create status cell      ---------------------------------------  
      addCbCell(tr, "choicer", usname);

      //create avatar cell -------------------------------------------------
      addImgCell(tr, usname, sizeImgAvatar);

      //create username cell ---------------------------------------------
      addTextCell(tr, usname, sizeFontChat);

      tbdy.appendChild(tr);
    }
  });
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
  $('#ulChoiceFriend').animate({ scrollTop: $('#ulChoiceFriend').prop("scrollHeight") }, 500);
}

function createNewChat() {

  document.getElementById("ulChoiceFriend").innerHTML = "";
  showFriendToChoice();

  document.getElementById("divCreateNewGroup").style.display = "block";
}

function CloseCreateNewGroup() {
  document.getElementById("divCreateNewGroup").style.display = "none";
}

function createNewGroup() {
  var roomMembers = [];

  const groupName = document.getElementById("inputGroupName");

  //add member
  var checkboxList = document.getElementsByName('choicer');
  roomMembers.push(socket.username);

  checkboxList.forEach(cb => {
    if (cb.checked == true) {
      roomMembers.push(cb.value);
    }
  });

  if (roomMembers.length >= 3) {
    socket.emit("createRoom", {
      roomName: groupName.value,
      roomMembers: roomMembers
    });
    createRoomResult();
  } else {
    alert('Please choice more people');
  }
}

function createRoomResult() {
  document.getElementById("btnCreateNewGroup").style.display = "none";
  setTimeout(() => {
    refreshData();
    document.getElementById("divCreateNewGroup").style.display = "none";
  }, 2000);

}
//-------------------------------------------------------------------------

//funcrtion process user find some thing in list chatter on sidebar
function enterCharPress(event) {

  var inputChar = document.getElementById("inSidebarFind");
  var findWhom = inputChar.value;

  var newChatList = [];

  if (findWhom.length) {//search box has value
    for (var i = 0; i < myListChat.length; i++) {
      var currentNickname = myListChat[i];
      if (currentNickname[0].indexOf(findWhom) > -1) {
        newChatList.push(currentNickname);
      };
    }
    clearTableChatList();
    createTableChatlist(newChatList);
  } else {  //serach box was clear  
    clearTableChatList();
    createTableChatlist(myListChat);
  }
}

//----------------------------------------------------------------------
var numberOfMessagePage = 1;

function readMoreMess() {
  numberOfMessagePage++;
  var readMoreMessInfo = {
    friendName: boxChatOf,
    count: numberOfMessagePage
  };
  socket.emit('readMoreMess', readMoreMessInfo);


}

socket.on('readMoreMessResult', function (result) {
  if (result) {
    clearChatBox();
    if (result.length > 0) {
      for (var k = result.length - 1; k >= 0; k--) {
        var mess = [];
        mess = result[k].slice();

        addaMessToWindow(mess, 1);
      }
    }

  } else {

  }
});



/* ------------------- code for alert ------------------ */
//single alert. an alert respond and action
function showAlert() {
  alert("alert");
}


function sidebarOpenAlert() {
  if (singleAlertType === alertFriendCall) {
    showMediaConferent();

    hideLocalVideo();

    showRemoteVideoControl();
    showCallFeedbackControl();
    hideRemoteVideo();

  } else {
    refreshData();
    socket.on('getChatListResult', () => {
      //reflectFunction(listCellName[0],friendInAlert);
      selectUser(friendInAlert);
    });
  }

}

function showSingleAlert(comeAlert) {

  //insert alert content
  document.getElementById("aSidebarSingleAlert").textContent = comeAlert;
  //display it
  document.getElementById("divSidebarSingleAlert").style.display = "block";

  //hide alert after few sec
  setTimeout(function () {
    document.getElementById("divSidebarSingleAlert").style.display = "none";
    document.getElementById("aSidebarSingleAlert").textContent = "";
    //clear global value
    singleAlertType = 0;
    friendInAlert = "";
  }, 9000);
}


socket.on("addFriendRequestAlert", function (friendRequest) {

  //friendInAlert is global value
  friendInAlert = friendRequest;
  var alert = friendInAlert + actContent[1];

  singleAlertType = alertAddFriendRequest;
  showSingleAlert(alert);
})