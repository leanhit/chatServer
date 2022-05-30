//global values.
const imgPath = "/images/upload/";
const iconPath = "/images/default/";
const avatarPath = "/images/avatar/";
const groupAvatarPath = "/images/default/defaultGroupAvatar.jpg";

//define info off user array
var loginInfo = [];

//this value will change while user open other chat box
var boxChatOf = '';
//array of chatter
var myListChat = [];

//array of rooms
var myListRooms = [];

const loginOk = 'ok';

const onlineStatus = 2;
const offlineStatus = 1;
const exitsFriend = 'exits';
const maxUsernameLength = 20;


const rlsStranger = 0;
const rlsLock = 1;
const rlsFriend = 2;
const rlsAddFriendRequest = 3;
const rlsAddFriendRecive = 4;
const rlsAddFriendWait = 5;
const rlsUnlock = 6;
const rlsUnfriend = 7;
const addFriendReject = false;
const addFriendAccept = true;
const addFriendCancel = 9;

var friendInAlert = "";
//do not use yet ----->
var singleAlertType = 0;
const alertFriendStatus = 1;
const alertAddFriendRequest = 2;
const alertFriendMessage = 3;
const alertGroupMessage = 4;
const alertFriendCall = 5;
const alertGroupCall = 6;
const actContent = [
  'sent add friend request',
  'sent a message to you',
  'sent s message to group ',
  'call to you ',
  'call to group '
]
//<-------------

//define actions in alert
const actAddFriend = 0;
const actMessageUser = 1;
const actMessageGroup = 2;
const actCallUser = 3;
const actCallGroup = 1;
const alertContents = ['',
  ' wana be your friend',
  '',
  ' messaed to you',
  ' messaged to group ',
  ' is calling you',
  ' is calling group '
]
const actAddFriendContent = " wana be your friend";
var myAlertList = [];

//call answers
const callUserOk = 0;
const callUserBusy = 1;
const callUserCancel = 2;


function getStatusIcon(status) {
  if (status == onlineStatus) {
    return iconPath + "onlineIcon.png";
  } else {
    return iconPath + "offlineIcon.png";
  }
}

function getStatusChatter(usname) {
  //if(myListChat.length){        

  for (var k = 0; k < myListChat.length; k++) {
    var aChar = myListChat[k].slice();
    alert(aChar);
    if (aChar[0] == usname) {

      return aChar[1];//2: online or 1: offline 

    } else {
      return 0; //new chater;
    }
  }
  // }
  // return 0; //new chater is ther first chater. no!!! alway has chatbot
}

function getFolderView(name) {
  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  var firstChar = name?.substr(0, 1);
  var index = alphabet.indexOf(firstChar);
  if (0 <= index && index <= 7) {
    return "atoh/";
  }
  else if (8 <= index && index <= 15) {
    return "itop/";
  }
  else if (16 <= index && index <= 25) {
    return "qtoz/";
  }
  else {
    return "other/";
  }
}

function getAvatarPathView(usname) {
  if (usname?.length > maxUsernameLength) {
    return groupAvatarPath;
  } else {
    return avatarPath + getFolderView(usname) + usname + "_avatar.png"
  }
}

function getRoomInfo(roomID) {
  let temp = '';
  myListRooms.forEach(room => {    
    if (room.roomID == roomID){
      return temp = room;
    }
  });
  return temp;
}


function getRelationship(username) {
  myListChat.forEach(user => {
    if (user.nameID == username)
      return user.rlsType;
  });

  return rlsStranger;
}

//----------------------------------------------------------------------------------------------

//img size define
const sizeImgStatus = "15";
const sizeImgAvatar = "30";
const sizeAvatarChat = "20";
const sizeImgChat = "120";
const sizeFontChat = "20";
const sizeFontTime = "8";

function addRb(rbName, rbValue) {
  var radiobutton = document.createElement('input');
  radiobutton.setAttribute('type', 'radio');
  radiobutton.setAttribute('name', rbName);
  radiobutton.setAttribute('value', rbValue);

  return radiobutton;
}

function addCb(cbName, cbValue) {
  var checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('name', cbName);
  checkbox.setAttribute('value', cbValue);

  return checkbox;
}

function addBtn() {
  var button = document.createElement('input');
  button.setAttribute('type', 'button');
  button.style.backgroundColor = 'aquablue';
  return button;
}

function addTbl(tbWidth, tbFloat) {
  var tbl = document.createElement('table');
  tbl.style.width = tbWidth;
  if (tbFloat !== null)
      tbl.style.float = tbFloat;
  tbl.setAttribute('border', '0');
  return tbl;
}

function addImg(imgID, imgSize) {
  var img = document.createElement('img');
  if (imgSize === sizeImgAvatar) {
      img.src = getAvatarPathView(imgID);
      img.height = imgSize;
  } else if (imgSize === sizeImgStatus) {
      img.src = getStatusIcon(imgID);
      img.height = imgSize;
  } else
      img.src = imgID;

  img.width = imgSize;

  return img;
}

function addImage(imgSrc, imgWidth) {
  var img = document.createElement('img');
  img.src = imgSrc;
  img.width = imgWidth;
  
  return img;
}

function addImgCell(tr, imgID, imgSize) {
  //console.log(imgID)
  var td = document.createElement('td');
  var img = document.createElement('img');
  if (imgSize === sizeImgAvatar || imgSize === sizeAvatarChat) {
      img.src = getAvatarPathView(imgID);
      img.height = imgSize;
  } else if (imgSize === sizeImgStatus) {
      img.src = getStatusIcon(imgID);
      img.height = imgSize;
      listCellStatus.push(td);
  } else if(imgSize === sizeImgChat)
      img.src = imgID;

  img.width = imgSize;
  td.style.width = imgSize;
  

  td.appendChild(img);
  //add cell to row
  tr.appendChild(td);
  return td;
}


function addTextCell(tr, text, fontSize) {
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(text));

  td.style.fontSize = fontSize;
  //add cell to row
  tr.appendChild(td);
  return td;
}

function addEmptyCell(tr) {
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(""));

  //add cell to row
  tr.appendChild(td);
}

function addBtn(btnName) {
  var btn = document.createElement('input');
  btn.setAttribute("type", "button");
  btn.setAttribute("value", btnName);
  return btn;
}

function addBtnCell(tr, btnName) {
  var td = document.createElement('td');
  var btn = addBtn(btnName);
  td.style.width = "20";
  td.appendChild(btn);
  //add cell to row
  tr.appendChild(td);
  return btn;
}

function addCbCell(tr, cbName, cbValue) {
  var td = document.createElement('td');
  //create status icon         
  var checkbox = document.createElement('input');
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("name", cbName);
  checkbox.setAttribute("value", cbValue);


  td.appendChild(checkbox);
  td.style.width = '5';
  //add cell to row
  tr.appendChild(td);
}