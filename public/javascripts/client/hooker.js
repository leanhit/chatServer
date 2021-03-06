var socket = io.connect(domainName);
let guestIp = "";
const rentHost = "localhost:8888";
let guestId = "";

window.onload = function () {
  setupGuestUser();
}

function validMobieNumber(mobieNumber) {
  var phoneno = /^\d{10}$/;
  if (mobieNumber.match(phoneno)) {
    if (mobieNumber[0] != '0') {
      return false
    } else
      return true;
  }
  else {
    return false;
  }
}

function getBrowserName() {
  var Browser = navigator.userAgent;
  if (Browser.indexOf('MSIE') >= 0) {
    Browser = 'MSIE';
  }
  else if (Browser.indexOf('Firefox') >= 0) {
    Browser = 'Firefox';
  }
  else if (Browser.indexOf('Chrome') >= 0) {
    Browser = 'Chrome';
  }
  else if (Browser.indexOf('Safari') >= 0) {
    Browser = 'Safari';
  }
  else if (Browser.indexOf('Opera') >= 0) {
    Browser = 'Opera';
  }
  else {
    Browser = 'UNKNOWN';
  }
  return Browser;
}

function getLocalIp() {
  return new Promise((resolve) => {
    /* Add "https://api.ipify.org?format=json" statement
             this will communicate with the ipify servers in
             order to retrieve the IP address $.getJSON will
             load JSON-encoded data from the server using a
             GET HTTP request */

    $.getJSON("https://api.ipify.org?format=json", function (data) {
      resolve(data.ip);
    });
  });
}

function getPhoneNumber() {
  let phoneNumber = $("#inPhoneNumber").val();
  if (validMobieNumber(phoneNumber)) {
    return phoneNumber;
  } else
    return false
}


function setupGuestUser() {
  boxChatOf = currentAdmin;
  let ipObj = getLocalIp();

  ipObj.then(ip => {
    let tempArray = ip.split('.');
    tempArray.forEach(temp => {
      guestIp += temp;
    });
    guestIp += "_";
  });
}

function setupGuestUser1() {
  boxChatOf = currentAdmin;

  const hostName = window.location.host;
  let browserName = getBrowserName();
  let ipObj = getLocalIp();

  if (1)/*(hostName === rentHost)*/ {
    ipObj.then(ip => {
      let tempArray = ip.split('.');
      let id = "";
      tempArray.forEach(temp => {
        id += temp;
      });

      guestId = guestIp + currentAdmin + "_" + id + "_" + browserName;
      loginACK("Guest_" + id + "_" + browserName);
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

function loginACK(guestName) {
  let messContent = guestName + " have been log in!!!";
  let messType = false;
  var mess = {
    sender: guestId,
    messType: messType,
    messContent: messContent,
    userGetMess: boxChatOf
  };

  socket.emit('guestMessage', mess);
}

function sendMessage() {
  let isOk = false;
  let phoneNumber = getPhoneNumber();
  let inPhoneNb = document.getElementById("inPhoneNumber");
  let inMessage = document.getElementById("inputMessage");

  if (phoneNumber) {
    enterPlease(true, inPhoneNb);
    guestId = guestIp + currentAdmin + "_" + phoneNumber;
    if (boxChatOf !== null) {
      let messType;
      let messContent;
      if (imgArrayToSend.length) {
        isOk = true;
        messType = true;
        messContent = imgArrayToSend;
      } else {
        if (inMessage.value?.length > 0) {
          isOk = true;
          messType = false;
          messContent = inMessage.value;
          enterPlease(true, inMessage);
        } else {
          isOk = false;
          enterPlease(false, inMessage);
        }
      }

      if (isOk) {
        var mess = {
          sender: guestId,
          messType: messType,
          messContent: messContent,
          userGetMess: boxChatOf
        };

        socket.emit('guestMessage', mess);
      }

      cleanInputMess(inMessage);
    }
  } else {
    alert("Ha??y nh????p s???? ??i????n thoa??i");
    enterPlease(true, inPhoneNb);
  }
}

function enterPlease(isCommand, inputElement) {
  if (isCommand) {
    inputElement.style.border = "0";

  } else {
    inputElement.style.border = "2";
    inputElement.style.borderBlockColor = "red";
    inputElement.focus();
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

//-------------------------get message frome server-----------------------------

socket.on('guestMessage', function (msg) {
  //check resource of message
  //view mess to window
  addaMessToWindow(msg);
});


function addaMessToWindow(mess) {
  var userSend = mess.sender;
  var messageTo = mess.userGetMess;

  var body = document.getElementById("messages");
  //set position of form        
  if (userSend.length > maxUsernameLength) {//yourselt
    //create table of mess
    addMessage(body, mess, "right");
  } else {//admin
    //create table of mess
    addMessage(body, mess, "left");
  }

  //scroll screen
  $('#messages').animate({ scrollTop: $('#messages').prop("scrollHeight") }, 500);
}

function addMessage(body, mess, side) {
  //create table of mess
  var tbl = addTbl('60%', side);
  var tbdy = document.createElement('tbody');
  if (side === "right") {
    for (var i = 0; i < 2; i++) {
      var tr = document.createElement('tr');
      for (var j = 0; j < 2; j++) {
        if (i == 0 && j == 1) {

        } else if (i == 0 && j == 0) {//content cell
          //give pic
          if (mess.messType) {
            mess.messContent.forEach(imgUrl => {
              let tdImg = addImgCell(tr, imgPath + imgUrl, sizeImgChat);
              tdImg.style.float = side;
            });
          } else {//text
            var tdText = addTextCell(tr, mess.messContent, sizeFontChat);
            tdText.style.float = side;
            tdText.style.color = "blue"
          }
        } else if (i == 1 && j == 0) {//time cell

        } else { //empty cell

        }
      }
      tbdy.appendChild(tr);
    }
  } else {
    for (var i = 0; i < 2; i++) {
      var tr = document.createElement('tr');
      for (var j = 0; j < 2; j++) {
        if (i == 0 && j == 0) {

        } else if (i == 0 && j == 1) {//content cell
          //give pic
          if (mess.messType) {
            mess.messContent.forEach(imgUrl => {
              let tdImg = addImgCell(tr, imgPath + imgUrl, sizeImgChat);
              tdImg.style.float = side;
            });
          } else {//text
            var tdText = addTextCell(tr, mess.messContent, sizeFontChat);
            tdText.style.float = side;
            tdText.style.color = "rebeccapurple";

          }
        } else if (i == 1 && j == 1) {//time cell

        } else { //empty cell

        }
      }
      tbdy.appendChild(tr);
    }
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
}