var MongoClient = require('mongodb').MongoClient;
var defineVal = require('./defineValue');

function addZero(number) {
    if (0 <= number && number <= 9) {
        return "0" + number;
    }
    return number;
}

function getDay() {
    var today = new Date();
    return addZero(today.getDate()) + '-' + addZero(today.getMonth() + 1) + '-' + today.getFullYear();
}

function getTimeNow() {
    //var today = new Date;
    //return today;
    var today = new Date();
    return addZero(today.getHours()) + ":" + addZero(today.getMinutes()) + ":" + addZero(today.getSeconds());
}

function dateTimeNow() {
    return today = new Date();
    //return getDay() + ' ' + getTimeNow();
}

function checkAccsessDB(sender, giver) {
    var length_1 = "";
    if (sender) {
        length_1=sender.length;
    } else {
        return false;
    }

    var length_2 = "";
    if (giver) {
        length_2=giver.length;
    } else {
        return false;
    }

    if ((6 <= length_1 || length_1 <= 30) && (6 <= length_2 || length_2 <= 30)) {
        return true;
    } else {
        return false;
    }
}

function createdDefaultUserDB(usName) {

    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        }
        else {
            //creater db chat list
            var dbo = db.db(defineVal.dbUser + usName);
            var newChater = {
                nameID: 'chatbot',
                realName: 'chatbot',
                created: new Date(),
                lastChat: new Date()
            };

            dbo.collection(defineVal.chatListCollection).insertOne(newChater, function (err, res) {
                if (err) throw err;
                else {
                    console.log("user database created");
                    db.close();
                }
            });
        }
    });


}

function UpdateImgCollection(username, collectionName, img) {
    var imgName = img[0];
    var image = img[1];
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        }
        else {
            var dbo = db.db(defineVal.dbUser + username);
            var newImage = {
                imgName: imgName,
                imgBase64: image,
                created: dateTimeNow()
            };
            dbo.collection(collectionName).insertOne(newImage, function (err, res) {
                if (err) throw err;
                else {
                    console.log("1 document inserted");
                    db.close();
                }
            });

        }
    });


}

function updateInfomation(username, userInfo) {

    const usn = userInfo[0].slice();//full name
    const firstName = usn[0];
    const lastName = usn[1];
    const psw = userInfo[1]; //password
    const email = userInfo[2]; //email
    const sex = userInfo[3]; //sexual
    const birthday = userInfo[4]; //birthday
    const nativeLand = userInfo[5];//where user was born
    const address = userInfo[6]// where user live



    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        } else {
            var dbo = db.db(dbAllUser);
            dbo.collection('users').findOneAndUpdate({ username: username }, {
                $set: {
                    "name": {
                        "firstName": firstName,
                        "lastName": lastName
                    },
                    "password": psw,
                    "email": email,
                    "sex": sex,
                    "birthday": birthday,
                    "nativeLand": nativeLand,
                    "address": address

                }
            }, function (err, user) {
                if (err) {
                    throw err;
                } else {
                    console.log("update user infomation complete!");
                    db.close();
                }
            });
        }
    });

}


const addToChatList = true;
const dellFromChatList = false;
const updateOderChatList = 'update';
function updateChatList(usname, chatter, addOrDel) {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        } else {
            const dbName = defineVal.dbUser + usname;
            var dbo = db.db(dbName);
            switch (addOrDel) {
                case addToChatList://insert        addOrDel = true                    
                    var newChater = {
                        nameID: chatter,
                        realName: 'team',
                        currentRlsStatus: rlsAddFriendRecive,
                        lastChat: dateTimeNow(),
                        created: dateTimeNow()
                    };
                    dbo.collection(defineVal.chatListCollection).insertOne(newChater, function (err, res) {
                        if (err) throw err;
                        else {
                            console.log("1 document inserted");
                            db.close();
                        }
                    });
                    break;

                case dellFromChatList: //delete addOrDel = fale
                    dbo.collection(defineVal.chatListCollection).deleteOne({ nameID: chatter }, function (err, res) {
                        if (err) throw err;
                        else {
                            console.log("1 document deleted");
                            db.close();
                        }
                    });

                    break;

                case updateOderChatList: //update last chat with this user
                    dbo.collection(defineVal.chatListCollection).findOneAndUpdate({ nameID: chatter }, { $set: { lastChat: dateTimeNow() } }, function (err, res) {
                        if (err) throw err;
                        else {
                            console.log("1 document updated");
                            db.close();
                        }
                    });
                    break;
                default:
            }
        }
    });
}


//------------------------------------------------------------

//build relationship user-user

/**define relationship
 * send request add friend 
 * give request add friend
 * send message to friend
 * send message to unfriend
 * give message from friend
 * give message from strange
 *  */

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

function addNewFriendToChatList(usname, chatter, relationship) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + usname;
                var dbo = db.db(dbName);
                var newChater = {
                    nameID: chatter,
                    realName: chatter,
                    currentRlsStatus: relationship,
                    //lastRlsStatus: rlsStranger,
                    lastChat: dateTimeNow(),
                    created: dateTimeNow()
                };
                dbo.collection(defineVal.chatListCollection).insertOne(newChater, function (err, res) {
                    if (err) reject(err);
                    else {
                        console.log("1 document inserted");
                        db.close();
                        resolve(newChater._id);
                    }
                });


            }
        });
    });
}

function changeRlsStatus(usname, chatter, newRlsStatus) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + usname;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.chatListCollection).findOneAndUpdate({ nameID: chatter }, { $set: { currentRlsStatus: newRlsStatus } },
                    function (err, res) {
                        if (err) reject(err);
                        else {
                            console.log("1 document updated");
                            //console.log(res); 
                            //console.log(res.value._id);   
                            //resolve(res.value._id);
                            if (res.value) {
                                resolve(res.value._id);
                            } else {
                                resolve(null);

                            }
                            db.close();
                        }
                    });

            }
        });
    });
}


//------------------------------------
//alert store

const alertIsNew = true;
const alertIsOld = false;
const alertAddnew = 1;
const deleteAlert = 2;
const updateAlert = 3;
//define actions in alert
const actAddFriend = 1;
const actAddFriendContent = " wana be your friend";

function updateAlertList(usname, commandType, contentID) {
    //console.log(usname +"    " + commandType + "  " + contentID);
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        } else {
            const dbName = defineVal.dbUser + usname;
            var dbo = db.db(dbName);
            switch (commandType) {

                case deleteAlert: //delete commandType = 2
                    dbo.collection(defineVal.alertListCollection).deleteOne({ contentID: contentID }, function (err, res) {
                        if (err) throw err;
                        else {
                            console.log("1 alert of " + usname + " deleted");

                            db.close();
                        }
                    });

                    break;

                case updateAlert: //update alert status
                    dbo.collection(defineVal.chatListCollection).findOneAndUpdate({ contentID: contentID }, { $set: { alertStatus: alertIsOld } }, function (err, res) {
                        if (err) throw err;
                        else {
                            console.log("1 document updated");
                            db.close();
                        }
                    });
                    break;

                default:
            }
        }
    });
}

function addNewAlert(usname, friendName, actionType, contentID) {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw (err);
        } else {
            const dbName = defineVal.dbUser + usname;
            var dbo = db.db(dbName);
            var newAlert = {
                contentID: contentID,
                actionUser: friendName,
                actionType: actionType,
                alertStatus: alertIsNew,
                created: dateTimeNow()
            };
            dbo.collection(defineVal.alertListCollection).insertOne(newAlert, function (err, res) {
                if (err) {
                    throw (err);
                } else {
                    console.log("1 document inserted");

                    db.close();
                    //resolve(newAlert._id);
                }
            });
        }
    });

}

function getAlertList(username) {
    return new Promise(function (resolve, reject) {
        var myAlertList = [];
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            }
            else {
                const dbName = defineVal.dbUser + username;
                const collectionName = "alertList";
                var dbo = db.db(dbName);
                dbo.collection(collectionName).find({}).sort({ "created": -1 }).toArray(function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        if (data.length <= 0) {
                            //there are no alert
                            resolve("");
                        } else {
                            data.forEach(function (anAlert) {
                                //setup myChatList
                                var tempAlert = {
                                    actionUser: anAlert.actionUser,
                                    actionType: anAlert.actionType,
                                    created: anAlert.created,
                                    id: anAlert._id,
                                    contentID: anAlert.contentID
                                }
                                myAlertList.push(tempAlert);
                            });
                        }
                        //return chat list to client
                        resolve(myAlertList);

                        db.close();
                    }
                });
            }
        });
    });
}
//--------------new code find user ------------------
function getRlsStatus(myNickname, userNickname) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + userNickname;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.chatListCollection).findOne({ nameID: myNickname }, function (err, user) {
                    if (err) reject(err);
                    else {
                        if (user == null) {  //can't find myName in chat list of userName           
                            resolve(rlsStranger);
                        } else {//find out
                            resolve(user.currentRlsStatus);
                        }
                        db.close();
                    }

                });

            }
        });
    });
}


const userNotExits = true;
function checkExitsUser(myNickname, userNickname) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + myNickname;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.chatListCollection).findOne({ nameID: userNickname }, function (err, user) {
                    if (err) reject(err);
                    else {
                        if (user == null) {  //can't find myName in chat list of userName           
                            resolve(userNotExits);
                        } else {//find out
                            resolve(user.currentRlsStatus);
                        }
                        db.close();
                    }

                });

            }
        });
    });
}


//--------------------------------

function checkValidUsername(username) {
    if (username?.length >= defineVal.minUsernameLength && username?.length <= defineVal.maxUsernameLength) {
        for (var i = 0; i < username.length; i++) {
            let aChar = username[i].slice();
            if (checkChar(aChar)) {
                //do nothing
            } else {
                return isUsnameOk = false;
            }
        }
        return isUsnameOk = true;
    } else {
        return isUsnameOk = false;
    }
}

function checkChar(aChar) {
    if (defineVal.validChar.indexOf(aChar) > -1)
        return true;
    else
        return false;
}

module.exports = {
    checkValidUsername: checkValidUsername,
    createdDefaultUserDB: createdDefaultUserDB,


    //-------------------------------------------------------------
    UpdateImgCollection: UpdateImgCollection,
    updateInfomation: updateInfomation,
    updateChatList: updateChatList,
    addToChatList: addToChatList,
    dellFromChatList: dellFromChatList,
    updateOderChatList: updateOderChatList,

    getDay: getDay,
    getTimeNow: getTimeNow,
    dateTimeNow: dateTimeNow,
    checkAccsessDB: checkAccsessDB,


    addNewFriendToChatList: addNewFriendToChatList,
    changeRlsStatus: changeRlsStatus,
    rlsStranger: rlsStranger,
    rlsLock: rlsLock,
    rlsUnlock: rlsUnlock,
    rlsFriend: rlsFriend,
    rlsUnfriend: rlsUnfriend,
    rlsAddFriendRequest: rlsAddFriendRequest,
    rlsAddFriendRecive: rlsAddFriendRecive,
    rlsAddFriendWait: rlsAddFriendWait,
    addFriendReject: addFriendReject,
    addFriendAccept: addFriendAccept,
    addFriendCancel: addFriendCancel,



    alertIsNew: alertIsNew,
    alertIsOld: alertIsOld,
    alertAddnew: alertAddnew,
    deleteAlert: deleteAlert,
    updateAlert: updateAlert,

    actAddFriend: actAddFriend,
    actAddFriendContent: actAddFriendContent,


    addNewAlert: addNewAlert,
    updateAlertList: updateAlertList,
    getAlertList: getAlertList,



    userNotExits: userNotExits,
    getRlsStatus: getRlsStatus,
    checkExitsUser: checkExitsUser,




}