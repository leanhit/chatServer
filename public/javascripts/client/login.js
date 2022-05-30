const domainName = "http://localhost:8888";
var socket = io.connect(domainName);
//login type
const loginByJwt = 0;
const loginToMongoDB = 1;
const loginToMssqlDB = 2;

//login failt result
const loginInvalidUsername = 0;
const loginInvalidPassword = 1;
const jwtExpired = 2;
const loginInvalidDb = 3;
const alertLogin = ["Invalid username", "Invalid password", "Token is expired", "Connect database fail"];



window.onload = function () {
    //get token from cookie
    if (getCookie('jwtoken')) {
        socket.emit('userLogin', {
            loginType: loginByJwt,
            content: getCookie('jwtoken')
        });
    } else {
        invalidLogin(null);
    }
}

function invalidLogin(failtType) {
    if (failtType !== null)
        alert("failtType " + alertLogin[failtType]);

    document.getElementById("divLoginForm").style.display = "block";
    document.getElementById("divStartPage").style.display = "none";
    document.getElementById("divSidebar").style.display = "none";
}

function btnLogin() {
    let temp
    if (domainName.indexOf("localhost") >= 0)
        temp = loginToMongoDB;
    else
        temp = loginToMssqlDB;

    socket.emit('userLogin', {
        loginType: temp,
        content: {
            password: $("#pswPass").val(),
            username: $("#txtUName").val()
        }
    });
}

socket.on('userLoginResult', (result) => {
    if (result.resultType) {
        socket.username = result.resultContent;

        //show hide element
        document.getElementById("divLoginForm").style.display = "none";
        document.getElementById("divStartPage").style.display = "block";
        document.getElementById("divSidebar").style.display = "block";
    } else {
        invalidLogin(result.resultContent);
    }
});


socket.on('jwtResult', function (token) {
    setCookie('jwtoken', token, "2000");
    console.log("write jwt token");
});

//------------module function----------------

function openPage(pageTag) {
    let aLogin = document.createElement('a');
    aLogin.setAttribute('href', pageTag);
    setTimeout(() => {
        aLogin.click();
    }, 10);
}


function showOneDiv(divShow) {
    let popups = document.getElementsByClassName("classDivPopup");
    for (var i = 0; i < popups.length; i++) {
        popups[i].style.display = 'none';
    }

    divShow.style.display = "block";

}

function closeDivByOutSideDivClick(xPoint, yPoint) {
    const divCoordinates = getCoordinates(currentActiveDiv);

    const topPoint = divCoordinates.topPoint;
    const leftPoint = divCoordinates.leftPoint;
    const rightPoint = divCoordinates.rightPoint;
    const bottomPoint = divCoordinates.bottomPoint;

    if ((xPoint > leftPoint && xPoint < rightPoint) && yPoint > topPoint && yPoint < bottomPoint) {
        //cursor inside div

    } else {
        currentActiveDiv.style.display = 'none';
        currentActiveDiv = divCoverAll;
        divCoverAll.style.display = 'block';
    }

}

function divClick(xPoint, yPoint) {
    if (isAddMenuClick) {
        showOneDiv(divTopbarAddMenu);
        isAddMenuClick = false;
    } else if (isMainMenuClick) {
        showOneDiv(divTopbarMainMenu);
        isMainMenuClick = false
    } else {
        closeDivByOutSideDivClick(xPoint, yPoint);
    }
}

function getCoordinates(element) {
    var rect = element.getBoundingClientRect();
    return {
        topPoint: rect.top,
        leftPoint: rect.left,
        rightPoint: rect.right,
        bottomPoint: rect.bottom
    }
}

function showit() {
    let xCoordinates = Event.x;
    let yCoordinates = Event.y;

    divClick(xCoordinates, yCoordinates);
}

function showitMOZ(e) {
    let xCoordinates = e.pageX;
    let yCoordinates = e.pageY;

    divClick(xCoordinates, yCoordinates);
}

function getPositionClick() {
    if (!document.all) {
        window.captureEvents(Event.CLICK);
        window.onclick = showitMOZ;
    } else {
        document.onclick = showit;
    }
}

