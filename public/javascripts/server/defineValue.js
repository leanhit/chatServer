//login type
const loginByJwt = 0;
const loginToMongoDB = 1;
const loginToMssqlDB = 2;

//login failt result
const loginInvalidUsername = 0;
const loginInvalidPassword = 1;
const loginInvalidDb = 3;
const jwtExpired = 2;

//username
const minUsernameLength = 5;
const maxUsernameLength = 20;
const validChar = "abcdefghijklmnopqrstuvwxyz123457890_";


//define of database
const dbAllUser = 'dbAllUser';
const baseUrl = 'mongodb://localhost:27017/';
const userColection = 'users';
const dbUser = "userDB_";

const chatListCollection = "chatList";
const alertListCollection = "alertList";
const roomsCounterCollection = "roomscounter";


//define db of jswToken
const refreshTokenCollection = 'refreshToken';


function checkValidUsername(username) {
    let isUsnameOk;
    if (username?.length >= minUsernameLength && username?.length <= maxUsernameLength) {
        for (var i = 0; i < username.length; i++) {
            let aChar = username[i].slice();
            if (validChar.indexOf(aChar) > -1){
                //do nothing
            } else {
                return isUsnameOk = false;
            }
        }
         isUsnameOk = true;
    } else {
         isUsnameOk = false;
    }
    return isUsnameOk;
}

module.exports = {
    checkValidUsername:checkValidUsername,
    
    minUsernameLength: minUsernameLength,
    maxUsernameLength: maxUsernameLength,
    validChar: validChar,

    loginByJwt: loginByJwt,
    loginToMongoDB: loginToMongoDB,
    loginToMssqlDB: loginToMssqlDB,

    loginInvalidUsername: loginInvalidUsername,
    loginInvalidPassword: loginInvalidPassword,
    loginInvalidDb: loginInvalidDb,
    jwtExpired: jwtExpired,




    dbAllUser: dbAllUser,
    baseUrl: baseUrl,

    chatListCollection: chatListCollection,
    alertListCollection: alertListCollection,
    roomsCounterCollection: roomsCounterCollection,
    userColection: userColection,
    dbUser: dbUser,
    refreshTokenCollection: refreshTokenCollection,


}