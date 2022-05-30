function startChat() {

  var formFindUser = document.getElementById("divFindUser");
  formFindUser.style.display = "block";
}

function closeNav() {
  document.getElementById("divFindUser").style.display = "none";
}

function showAlertFindUser() {

  var showHideForm = document.getElementById("popupFindUser");
  showHideForm.style.display = "block";

  setTimeout(function () {
    showHideForm.style.display = "none";
  }, 1500);
}

function showAlertChangeAvatar() {

  var showHideForm = document.getElementById("popupChangeAvatar");
  showHideForm.style.display = "block";

  setTimeout(function () {
    showHideForm.style.display = "none";
  }, 1500);
}

//------------------------------------------


function setupStartFrame() {
  document.getElementById("sayHiUser").textContent = "Wellcome " + socket.username;
  document.getElementById("imgHiDivAvatar").src = getAvatarPathView(socket.username);
}

//--------------------------------------------


function ChangeAvatar() {
  var newAvatarSelector = document.createElement("input");
  newAvatarSelector.setAttribute("type", "file");
  newAvatarSelector.setAttribute("accept", ".jpg");
  newAvatarSelector.click();

  newAvatarSelector.addEventListener("change", selectNewAvatar);

  function selectNewAvatar() {
    var reader = new FileReader();
    reader.readAsDataURL(newAvatarSelector.files[0]);
    reader.onload = function (e) {
      socket.emit('updateAvatar', { base64: e.target.result });

      socket.on('updateAvatarResult', function (data) {
        if (data) {
          document.getElementById("imgHiDivAvatar").src = e.target.result;
          document.getElementById("imgSidebarMyAvatar").src = e.target.result;
        }
      });

    }
  }
  newAvatarSelector.remove();
}


//---------------------------------------------
function validateEmail(textContent) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(textContent).toLowerCase());
}

function validatePhoneNumber(textContent) {
  const vnpRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  return vnpRegex.test(textContent);
}

function enterUsername(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    findNewUser();
  }
}

function findNewUser() {
  var searchInfo = [];
  var searchType = 0;
  var searchContent = $("#inputFindNewUser").val();

  if (validateEmail(searchContent) === true) {
    searchType = 2;
  }
  else if (validatePhoneNumber(searchContent) === true) {
    searchType = 1;
  }
  else {
    searchType = 0;
  }
  searchInfo.push(searchContent);
  searchInfo.push(searchType);

  //now just send it
  if (searchContent == socket.username) {
    alert("you find yourselt!");
    clearFindInput();
  } else {
    let searchFrom;
    if (domainName.indexOf("localhost") > -1)
      searchFrom = true;
    else searchFrom = false;

    socket.emit('findUser', {
      searchFrom:searchFrom,
      searchContent:searchContent
    });
  }
}


socket.on('findUserResult', function (result) {

  if (result === false) {
    alert("Can't find");
  }
  else {
    rlsStatus = result.rlsStatus;

    if (rlsStatus === rlsLock) { //findout but this one block you
      alert("Can't find");
      clearFindInput();
    } else {

      clearFindInput();
      createFindResultView(result);
    }
  }

});

//clear find box
function clearFindBox() {
  var box = document.getElementById("ulFindUserResult");
  box.innerHTML = "";
}

function clearFindInput() {
  $("#inputFindNewUser").val("");
}

function createFindResultView(aFindResult) {
  const friendRlsStatus = aFindResult.rlsStatus;
  const friendName = aFindResult.username;
  const email = "null";
  const phoneNumber = "null";

  const myRlsStatus = getRelationship(friendName);


  clearFindBox();

  var body = document.getElementById("ulFindUserResult");
  var tblView = document.createElement('table');

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

  //create row of info - email -----------------
  var trEmail = document.createElement('tr');
  var tdLabelEmail = document.createElement('td');
  tdLabelEmail.appendChild(document.createTextNode("Email address: "));

  var tdEmail = document.createElement('td');
  tdEmail.appendChild(document.createTextNode(email));

  //add cell to row
  trEmail.appendChild(tdLabelEmail);
  trEmail.appendChild(tdEmail);

  //create row of info - phone number -----------------
  var trPhoneNb = document.createElement('tr');
  var tdLabelPhoneNb = document.createElement('td');
  tdLabelPhoneNb.appendChild(document.createTextNode("Phone number: "));

  var tdPhoneNb = document.createElement('td');
  tdPhoneNb.appendChild(document.createTextNode(phoneNumber));

  //add cell to row
  trPhoneNb.appendChild(tdLabelPhoneNb);
  trPhoneNb.appendChild(tdPhoneNb);

  //create row of action -----------------
  var trAction = document.createElement('tr');
  trAction.colSpan = "2";

  var tdAction = document.createElement('td');
  //create button Chat now
  var btnSendMess = document.createElement('BUTTON');
  btnSendMess.addEventListener('click', clickSendMessNow);
  btnSendMess.textContent = "Chat";
  //reflection to outside function
  function clickSendMessNow() {
    sendMessageNow(friendName);
  }

  //create button accept request add friend
  var btnAccept = document.createElement('BUTTON');
  btnAccept.addEventListener('click', clickAccept);
  btnAccept.textContent = "Accept";
  //reflection to outside function
  function clickAccept() {
    changeRelationship(addFriendAccept, friendName);
  }

  //create button reject Add Friend
  var btnReject = document.createElement('BUTTON');
  btnReject.addEventListener('click', clickReject);
  btnReject.textContent = "Reject";
  //reflection to outside function
  function clickReject() {
    changeRelationship(addFriendReject, friendName);
  }

  //create button cancel Add Friend
  var btnCancel = document.createElement('BUTTON');
  btnCancel.addEventListener('click', clickCancel);
  btnCancel.textContent = "Cancel";
  //reflection to outside function
  function clickCancel() {
    changeRelationship(addFriendCancel, friendName);
  }

  //create button lock Friend
  var btnLock = document.createElement('BUTTON');
  btnLock.addEventListener('click', clickLock);
  btnLock.textContent = "Lock";
  //reflection to outside function
  function clickLock() {
    changeRelationship(rlsLock, friendName);
  }

  //create button unlock Friend
  var btnUnlock = document.createElement('BUTTON');
  btnUnlock.addEventListener('click', clickUnlock);
  btnUnlock.textContent = "Unlock";
  //reflection to outside function
  function clickUnlock() {
    changeRelationship(rlsUnlock, friendName);
  }

  //create button unriend
  var btnUnfriend = document.createElement('BUTTON');
  btnUnfriend.addEventListener('click', clickUnfriend);
  btnUnfriend.textContent = "Unfriend";
  //reflection to outside function
  function clickUnfriend() {
    changeRelationship(rlsUnfriend, friendName);
  }

  //create button Add Friend
  var btnAddFriend = document.createElement('BUTTON');
  btnAddFriend.addEventListener('click', clickAddFriend);
  btnAddFriend.textContent = "Add friend";
  //reflection to outside function
  function clickAddFriend() {
    addFriend(friendName);
  }

  if (friendRlsStatus === rlsStranger) {
    tdAction.appendChild(btnSendMess);
    tdAction.appendChild(btnAddFriend);
  } else if (friendRlsStatus === rlsAddFriendRecive || friendRlsStatus === rlsAddFriendWait) {
    tdAction.appendChild(btnSendMess);
    tdAction.appendChild(btnCancel);
  } else if (friendRlsStatus === rlsAddFriendRequest) {
    tdAction.appendChild(btnAccept);
    tdAction.appendChild(btnReject);
  } else if (friendRlsStatus === rlsFriend) {
    tdAction.appendChild(btnSendMess);
    tdAction.appendChild(btnUnfriend);
  }
  else {
    //thinking
  }

  //add cell to row
  trAction.appendChild(tdAction);

  //add row to tbdy  ---------------------------------------------

  tbdy.appendChild(trAvatar);
  tbdy.appendChild(trNickname);
  tbdy.appendChild(trEmail);
  tbdy.appendChild(trPhoneNb);
  tbdy.appendChild(trAction);

  tblView.appendChild(tbdy);
  body.appendChild(tblView);
}

function addFriend(friendName) {

  socket.emit('addFriend', friendName);

  socket.on('addFriendResult', function (data) {
    if (data == true) {
      clearFindBox();
      refreshData();
    }
  });
}

function sendMessageNow(usname) {

  socket.emit('addFriend', usname);

  socket.on('addFriendResult', function (data) {
    if (data == true) {
      refreshData();
      clearFindBox();
      document.getElementById("divFindUser").style.display = "none";

      socket.on('getChatListResult', () => {
        reflectFunction(usname);
      });
    }
  });
}

//-------------alert show---------------

socket.on('getAlertListResult', function (data) {

  myAlertList = data;
  var alertArena = document.getElementById("ulAlertShow");
  showAlertsList(alertArena, myAlertList);

});

function showAlertsList(body, inputList) {
  if (inputList.length > 0) {
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '0');

    var tbdy = document.createElement('tbody');

    inputList.forEach(anAlert => {
      const actUser = anAlert.actionUser;
      const actType = anAlert.actionType;
      const actTime = anAlert.created;
          //id,
      //contentID
      
      var trContent = document.createElement('tr');
      

      //create avatar cell -------------------------------------------------
      addImgCell(trContent, actUser, sizeImgAvatar);

      //create action detail cell ---------------------------------------------
      var td = document.createElement('td');
      var alertContent = actUser + actAddFriendContent;

      td.appendChild(document.createTextNode(alertContent));
      //catch event click user name in list
      td.addEventListener('click', clickAlert);
      //reflection to outside function
      function clickAlert() {

        selectUser(actUser);

        setTimeout(function () {
          var myAnswer = {
            rlsType: "reaction",
            friendName: actUser
          };
          socket.emit('changeRelationship', myAnswer);
        }, 500);
      }
      //add cell to row  ---------------------------------------------
      trContent.appendChild(td);

      //create tr of date create
      var trTime = document.createElement('tr');
      //create time cell -------------------------------------------------
      var tdEmpty = document.createElement('td');
      tdEmpty.appendChild(document.createTextNode(""));
      //add cell to row  ---------------------------------------------
      trTime.appendChild(tdEmpty);

      //create time cell -------------------------------------------------
      var tdTime = document.createElement('td');
      tdTime.appendChild(document.createTextNode(actTime));
      //add cell to row  ---------------------------------------------
      trTime.appendChild(tdTime);

      tbdy.appendChild(trContent);
      tbdy.appendChild(trTime);
    });
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
  } else {
    var tdEmpty = document.createElement('a');
    tdEmpty.appendChild(document.createTextNode("You are no new alert"));
    //add cell to row  ---------------------------------------------
    body.appendChild(tdEmpty);
  }
}
