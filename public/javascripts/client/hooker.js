var socket = io.connect(domainName);
const prefix = "guestOf_";
const rentHost = "localhost:8888";
const currentAdmin = "hoingx";

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

function setupGuestUser() {
  boxChatOf = currentAdmin;
  $("#inAdminUsername").val(boxChatOf);

  const hostName = window.location.host;
  let ipObj = getLocalIp();

  if (hostName === rentHost) {
    ipObj.then(ip => {
      let tempArray = ip.split('.');
      let id = "";
      tempArray.forEach(temp => {
        id += temp;
      });

      guestId = prefix + currentAdmin + "_" + id;

    })

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
      sender: guestId,
      messType: messType,
      messContent: messContent,
      userGetMess: boxChatOf
    };

    console.log(mess)
    socket.emit('guestMessage', mess);

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
  if ((userSend.length >maxUsernameLength)||(messageTo.length>maxUsernameLength)) {//yourselt
    //create table of mess
    addMessage(body, mess, "right");
  }else{//admin
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
            mess.messContent.forEach(imgUrl=>{
              let tdImg = addImgCell(tr, imgPath + imgUrl, sizeImgChat);
              tdImg.style.float = side;
            });
          } else {//text
            var tdText = addTextCell(tr, mess.messContent, sizeFontChat);
            tdText.style.float = side;

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
            mess.messContent.forEach(imgUrl=>{
              let tdImg = addImgCell(tr, imgPath + imgUrl, sizeImgChat);
              tdImg.style.float = side;
            });
          } else {//text
            var tdText = addTextCell(tr, mess.messContent, sizeFontChat);
            //tdText.style.float = side;

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