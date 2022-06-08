var MongoClient = require('mongodb').MongoClient;
const { dateTimeNow } = require('./dbAccess');
var defineVal = require('./defineValue');

const deleteGuest = 2;
const updateGuest = 3;


function addNewGuest(usname, guestIdentify, guestName) {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw (err);
        } else {
            const dbName = defineVal.dbUser + usname;
            var dbo = db.db(dbName);
            var newGuest = {
                guestID: guestIdentify,
                guestName: guestName,
                created: dateTimeNow(),
                lastChat: dateTimeNow(),
            };
            dbo.collection(defineVal.guestsListColection).insertOne(newGuest, function (err, res) {
                if (err) {
                    throw (err);
                } else {
                    console.log("A new guest added");

                    db.close();
                    //resolve(newAlert._id);
                }
            });
        }
    });

}

function updateGuestList(usname, commandType, guestIdentify) {
    console.log(usname, commandType, guestIdentify);
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        } else {
            const dbName = defineVal.dbUser + usname;
            var dbo = db.db(dbName);
            switch (commandType) {
                case deleteGuest: //delete commandType = 2
                    dbo.collection(defineVal.guestsListColection).deleteOne({ guestID: guestIdentify }, function (err) {
                        if (err) throw err;
                        else {
                            console.log("1 guest of " + usname + " deleted");
                            db.close();
                        }
                    });

                    break;

                case updateGuest: //update alert status
                    dbo.collection(defineVal.guestsListColection).findOneAndUpdate({ guestID: guestIdentify }, 
                        { $set: { lastChat: new Date() } }, function (err, res) {
                        if (err) throw err;
                        else {
                            console.log("1 guest document updated");
                            db.close();
                        }
                    });
                    break;

                default:
            }
        }
    });
}

function getGuestsList(username) {
    return new Promise(function (resolve, reject) {
        var myGuestList = [];
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            }
            else {
                const dbName = defineVal.dbUser + username;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.guestsListColection).find({}).sort({ "lastChat": -1 }).toArray(function (err, data) {
                    if (err) {
                        resolve({ resultType: false });
                        throw err;
                    } else {
                        resolve({
                            resultType: true,
                            resultContent: data
                        });

                        db.close();
                    }
                });
            }
        });
    });
}

const guestNotExits = false;
const guestExits = true;
function checkExitsGuest(myNickname, guestIdentify) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + myNickname;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.guestsListColection).findOne({ guestID: guestIdentify }, function (err, guest) {
                    if (err) reject(err);
                    else {
                        if (guest == null) {  //can't find myName in chat list of userName           
                            resolve(guestNotExits);
                        } else {//find out
                            resolve(guestExits);
                        }
                        db.close();
                    }

                });

            }
        });
    });
}


module.exports = {
    deleteGuest:deleteGuest,
    updateGuest:updateGuest,
    guestNotExits:guestNotExits,
    guestExits:guestExits,

    addNewGuest:addNewGuest,
    updateGuestList:updateGuestList,
    getGuestsList:getGuestsList,
    checkExitsGuest:checkExitsGuest    
}