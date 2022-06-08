function setupMainFrame() {
  var topbarChaterName = document.getElementById("aTopbarChaterName");

  document.getElementById("divStartPage").style.display = "none";
  document.getElementById("divMain").style.display = "block";
  document.getElementById("inputMessage").value = '';
  if (boxChatOf.length <= maxUsernameLength) {
    topbarChaterName.textContent = boxChatOf;

  } else {
    var room = getRoomInfo(boxChatOf);
    var roomName = room.roomName;
    topbarChaterName.textContent = roomName;
    topbarChaterName.addEventListener("click", openGroupForm);
    function openGroupForm() {
      if (boxChatOf.length > maxUsernameLength) {
        document.getElementById("divEditGroup").style.display = "block";
        refreshData();
      }
    }
  }
}

function addOption(friendName) {
  var body = document.getElementById("messages");
  var tblView = document.createElement('table');
  tblView.style.margin = "auto";

  var tbdy = document.createElement('tbody');

  //create row of avatar
  var trAvatar = document.createElement('tr');
  var tdAvatar = document.createElement('td');
  tdAvatar.colSpan = "2";

  //create status icon         
  var imgAvatar = document.createElement('img');
  var avaPath = getAvatarPathView(friendName);
  imgAvatar.src = avaPath;
  imgAvatar.alt = avaPath;
  imgAvatar.width = "200";
  imgAvatar.height = "200";
  tdAvatar.appendChild(imgAvatar);
  //add cell to row
  trAvatar.appendChild(tdAvatar);

  //create row of info - usname -----------------
  var trNickname = document.createElement('tr');
  var tdLabelNickname = document.createElement('td');
  tdLabelNickname.appendChild(document.createTextNode("Nickname: "));

  var tdNickname = document.createElement('td');
  tdNickname.appendChild(document.createTextNode(friendName));

  //add cell to row
  trNickname.appendChild(tdLabelNickname);
  trNickname.appendChild(tdNickname);

  //create row of action -----------------
  var trAction = document.createElement('tr');
  trAction.colSpan = "2";

  var tdAction = document.createElement('td');
  //create button Chat now
  var btnAccept = document.createElement('BUTTON');
  btnAccept.addEventListener('click', clickAccept);
  btnAccept.textContent = "Accept";
  //reflection to outside function
  function clickAccept() {
    changeRelationship(addFriendAccept, friendName);

  }
  tdAction.appendChild(btnAccept);

  //create button Add Friend
  var btnReject = document.createElement('BUTTON');
  btnReject.addEventListener('click', clickReject);
  btnReject.textContent = "Reject";
  //reflection to outside function
  function clickReject() {
    changeRelationship(addFriendReject, friendName);

  }
  tdAction.appendChild(btnReject);

  //add cell to row
  trAction.appendChild(tdAction);

  //add row to tbdy  ---------------------------------------------

  tbdy.appendChild(trAvatar);
  tbdy.appendChild(trNickname);

  tbdy.appendChild(trAction);

  tblView.appendChild(tbdy);
  body.appendChild(tblView);
  $('#messages').animate({ scrollTop: $('#messages').prop("scrollHeight") }, 500);

}

function changeRelationship(reaction, friendName) {
  var myAnswer = {
    rlsType: reaction,
    friendName: friendName
  }
  socket.emit("changeRelationship", myAnswer);
  clearFindBox();
  return (false);
}

socket.on("changeRelationshipResult", function (friendAnswer) {
  var feedbackType = data.rlsType;
  var friendName = data.friendName;

  var answerContent = '';
  if (feedbackType) {
    answerContent = friendName + " accepted your add friend request";
  } else {
    answerContent = friendName + " rejected your add friend request";
  }


  //singleAlertType = alertAddFriendRequest;
  showSingleAlert(answerContent);
});

function addMessage(body, mess, side) {
  //create table of mess
  var tbl = addTbl('60%', side);
  
  var tbdy = document.createElement('tbody');
  if (side === "right") {
    for (var i = 0; i < 2; i++) {
      var tr = document.createElement('tr');
      for (var j = 0; j < 2; j++) {
        if (i == 0 && j == 1) {        //avatar of chatter if readed cell          
          let imgCell = addImgCell(tr, socket.username, sizeAvatarChat);
          imgCell.rowSpan = '2';

        } else if (i == 0 && j == 0) {//content cell
          //give pic
          if (mess.messType) {
            mess.messContent.forEach(imgUrl => {
              let tdImg = addImgCell(tr, imgPath + imgUrl, sizeImgChat);
              tdImg.style.float = side;
            });
          } else {//text
            var tdText = addTextCell(tr, mess.messContent, sizeFontChat);
            tdText.style.color= "blue";
            tdText.style.float = side;
          }
        } else if (i == 1 && j == 0) {//time cell
          var td = addTextCell(tr, mess.created, sizeFontTime);
          td.style.float = side;

        } else { //empty cell

        }
      }
      tbdy.appendChild(tr);
    }
  } else {
    for (var i = 0; i < 2; i++) {
      var tr = document.createElement('tr');
      
      for (var j = 0; j < 2; j++) {
        if (i == 0 && j == 0) {        //avatar of chatter if readed cell          
          let imgCell = addImgCell(tr, boxChatOf, sizeAvatarChat);
          imgCell.rowSpan='2';

        } else if (i == 0 && j == 1) {//content cell
          //give pic
          if (mess.messType) {
            mess.messContent.forEach(imgUrl => {
              let tdImg = addImgCell(tr, imgPath + imgUrl, sizeImgChat);
              tdImg.style.float= side;
            });
          } else {//text
            var tdText = addTextCell(tr, mess.messContent, sizeFontChat);
            tdText.style.color= "rebeccapurple";
            
            
          }
        } else if (i == 1 && j == 1) {//time cell
          var td = addTextCell(tr, mess.created, sizeFontTime);
          td.style.textAlign= side;

        } else { //empty cell

        }
      }
      tbdy.appendChild(tr);
    }
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
}

function addaMessToWindow(mess, showType) {

  var userSend = mess.sender;
  var messageTo = mess.userGetMess;
  var members = [];

  if (isChatWithGuest) {
    showGuestMessage(mess);
  } else {
    if (messageTo.length > maxUsernameLength) { //message send to room
      if (boxChatOf == messageTo) {//roomID is equar
        var room = getRoomInfo(messageTo);//open chat group => boxChatOf is a roomID

        //get members of the room with roomID = boxChatOf
        members = room.members;
      } else {  //message to an other room 
        singleAlertType = alertGroupMessage;
        friendInAlert = messageTo;

        var alertContent = userSend + " messaged " + messageTo;
        showSingleAlert(alertContent);
      }
    } else { //mess frome user send to user

      if (userSend != socket.username && userSend != boxChatOf) {
        singleAlertType = alertFriendMessage;
        friendInAlert = userSend;

        var alertContent = friendInAlert + " messaged you";
        showSingleAlert(alertContent);

      }
    }

    var body = document.getElementById("messages");
    //set position of form        
    if (socket.username == userSend) {//yourselt
      //create table of mess
      addMessage(body, mess, "right");

    } else if ((boxChatOf == userSend && boxChatOf.length <= maxUsernameLength && messageTo.length <= maxUsernameLength) ||
      (members.indexOf(userSend) > -1)) {//your friend or member of room

      //create table chat list
      addMessage(body, mess, "left");
    }
  }

  if (showType) {
    //do not roll down screen

  } else {
    //scroll screen
    $('#messages').animate({ scrollTop: $('#messages').prop("scrollHeight") }, 500);
  }
}


//clear chat box
function clearChatBox() {
  var mess = document.getElementById("messages");
  mess.innerHTML = "";
}

//catch select chose friend chat
function selectUser(usname) {
  boxChatOf = usname;
  setupMainFrame();

  if (boxChatOf == null) {
    //wait chose user chat     
  } else {
    //open chat box off
    socket.emit('openChatBox', boxChatOf);

  }
}

//listen answer message from server
socket.on('openChatBoxResult', function (result) {


  clearChatBox();
  if (result.length > 0) {
    result?.forEach(mess => {
      addaMessToWindow(mess);
    });
  }
  var userRelationship = getRelationship(boxChatOf);
  if (userRelationship === rlsAddFriendRecive) {
    addOption(boxChatOf);
  }
});

socket.on('message', function (msg) {
  //check resource of message
  //view mess to window
  addaMessToWindow(msg);
});

function delMess() {
  if (confirm("Delete this user?")) {
    //delete all mess of an user
    socket.emit('deleteMessOf', {
      userType: isChatWithGuest,
      userId :boxChatOf
    })

    socket.on('deleteMess', function (result) {
      if (result == 'ok') {


      } else {

      }
    });
  }
}



//array store all img user choice to send  
var imgArrayToSend = [];
//array store all img element added to prewive diw
var imgOnDivPreview = [];
// Proxy button for <input/>
function choiceImg() {

  document.getElementById("fileSelector").click();
};


function previewFiles() {
  var preview = document.querySelector('#preview');
  var files = document.querySelector('input[type=file]').files;

  function readAndPreview(file) {
    var reader = new FileReader();

    reader.addEventListener("load", function () {
      var image = new Image();
      image.height = "35";
      image.title = file.name;
      image.src = this.result;
      //add img to send
      imgArrayToSend.push({ base64: this.result });
      //add img to dell
      imgOnDivPreview.push(image);
      //add img to show
      preview.appendChild(image);
    }, false);

    reader.readAsDataURL(file);
  }

  if (files) {
    [].forEach.call(files, readAndPreview);
  }
}

function enterPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
  }
}

function sendMessage() {
  if (boxChatOf !== null) {
    let input = document.getElementById("inputMessage");
    let messType;
    let messContent;
    if (input.value) {
      messType = false;
      messContent = input.value;
    } else if (imgArrayToSend.length) {
      messType = true;
      messContent = imgArrayToSend;
    }

    var mess = {
      sender: socket.username,
      messType: messType,
      messContent: messContent,
      userGetMess: boxChatOf
    };

    if (isChatWithGuest)
      socket.emit('guestMessage', mess);
    else
      socket.emit('message', mess);
    cleanInputMess(input);
  }
}

function cleanInputMess(input) {
  //clear imgArrayToSend aftersend it
  if (imgArrayToSend.length) {
    imgArrayToSend = [];
    for (var i = 0; i < imgOnDivPreview.length; i++) {
      imgOnDivPreview[i].remove();
    }
  }
  //clear imgArrayToSend
  if (imgArrayToSend.length) {
    imgArrayToSend = [];
  }
  input.value = '';

}

//------------------------------------------------------


function CloseEditGroup() {
  document.getElementById("divEditGroup").style.display = "none";
}

function setupFriendList(type) {
  var room = getRoomInfo(boxChatOf);
  var members = room.members;
  if (type == 1) {
    return members;
  } else {
    var templist = [];

    myListChat.forEach(aChatter => {
      const username = aChatter.nameID;

      if ((members.indexOf(username) < 0) && username.length < maxUsernameLength && username != "chatbot") {
        templist.push(username);
      }
    });
    return templist;
  }
}

var deleteButtonsList = [];
function showMembersToDelete() {
  //clear deleteButtonsList
  deleteButtonsList = [];

  var members = setupFriendList(1);

  var body = document.getElementById('ulSelectFriend');
  body.innerHTML = "";
  var tbl = addTbl("100%", null);

  var tbdy = document.createElement('tbody');
  members.forEach(member => {
    //create row
    var tr = document.createElement('tr');

    //create bntDelMember cell      ---------------------------------------  
    if (member != socket.username) {
      var btnDelMember = addBtnCell(tr, "Delete");

      var temp = {
        username: member,
        btnDel: btnDelMember
      };
      deleteButtonsList.push(temp);

      btnDelMember.addEventListener("click", deleteThisMember);
      function deleteThisMember() {
        deleteMemberFromGroup(member);
      }
    } else
      addEmptyCell(tr);

    //create avatar cell -------------------------------------------------
    addImgCell(tr, member, sizeImgAvatar);

    //create username cell ---------------------------------------------
    addTextCell(tr, member);

    //adc tr to tbdy
    tbdy.appendChild(tr);

  });
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
  $('#ulSelectFriend').animate({ scrollTop: $('#ulSelectFriend').prop("scrollHeight") }, 500);

}

var addButtonsList = [];
function showUsersToAdd() {
  //clear addButtonsList
  addButtonsList.splice(0, addButtonsList.length);

  var roomMember = setupFriendList(0);

  var chatterNumber = roomMember.length;
  var body = document.getElementById('ulSelectFriend');
  body.innerHTML = "";
  var tbl = addTbl("100%", null);

  var tbdy = document.createElement('tbody');
  for (var i = 0; i < chatterNumber; i++) {
    //create row
    var tr = document.createElement('tr');
    const usname = roomMember[i].slice();


    //create btnAddMember cell      ---------------------------------------  
    if (usname != socket.username) {
      var btnAddMember = addBtnCell(tr, "Add");

      var temp = {
        username: usname,
        btnAdd: btnAddMember
      };
      addButtonsList.push(temp);

      btnAddMember.addEventListener("click", addThisMember);
      function addThisMember() {
        addMemberToGroup(usname);
      }
    }

    //create avatar cell -------------------------------------------------
    addImgCell(tr, usname, sizeImgAvatar);

    //create username cell ---------------------------------------------
    addTextCell(tr, usname, null);

    //add tr to tbdy  ---------------------------------------------
    tbdy.appendChild(tr);

  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl);

  $('#ulSelectFriend').animate({ scrollTop: $('#ulSelectFriend').prop("scrollHeight") }, 500);

}

function deleteMemberFromGroup(usname) {
  if (confirm("Remove " + usname + " from group?")) {
    var removeInfo = {
      roomID: boxChatOf,
      userDel: usname
    };

    socket.emit("removeGroupMember", removeInfo);

    deleteButtonsList.forEach(btn => {
      if (usname == btn.username) {
        btn.btnDel.remove();
      }
    });
  }
  refreshData();
}

function addMemberToGroup(usname) {
  if (confirm("Add " + usname + " to group?")) {
    var addInfo = {
      roomID: boxChatOf,
      newMenber: usname
    };
    socket.emit("addGroupMember", addInfo);

    addButtonsList.forEach(btn => {
      if (usname == btn.username) {
        btn.btnAdd.remove();
      }
    });
  }
  refreshData();
}

function enterNewGroupName(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    changeGroupName();
  }
}

function changeGroupName() {
  var newName = document.getElementById("inputNewGroupName").value;

  var newNameInfo = {
    roomID: boxChatOf,
    newName: newName
  };
  socket.emit("changeGroupName", newNameInfo);
  document.getElementById("aTopbarChaterName").textContent = newName;
  document.getElementById("inputNewGroupName").value = "";
  refreshData();


}

function refreshData() {
  setTimeout(function () {
    socket.emit("refreshData");
  }, 500);
}