let defineVal = require('./defineValue');
let MongoClient = require('mongodb').MongoClient;

//active with db function
function saveMessTxtRoom(username, collectionName, mess, sender) {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        }
        else {
            var dbo = db.db(defineVal.dbUser + username);
            var newMess = {
                sender: sender,
                textMess: mess,
                created: new Date()
            };
            dbo.collection(collectionName).insertOne(newMess, function (err, res) {
                if (err) throw err;
                else {
                    console.log("1 document inserted to room: " + username + "//" + collectionName);
                    db.close();
                }
            });

        }
    });
}

function saveMessImageBase64Room(username, collectionName, mess, sender) {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        }
        else {
            var dbo = db.db(defineVal.dbUser + username);
            var newMess = {
                sender: sender,
                imgBase64: mess,
                created: new Date()
            };
            dbo.collection(collectionName).insertOne(newMess, function (err, res) {
                if (err) throw err;
                else {
                    console.log("1 document inserted");
                    db.close();
                }
            });

        }
    });
}

function saveMessTxtSender(username, collectionName, mess) {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        }
        else {
            var dbo = db.db(defineVal.dbUser + username);
            var newMess = {
                sender: username,
                textMess: mess,
                created: new Date()
            };
            dbo.collection(collectionName).insertOne(newMess, function (err, res) {
                if (err) throw err;
                else {
                    console.log("1 message was saved in db of " + username);
                    db.close();
                }
            });

        }
    });
}

function saveMessTxtGiver(username, collectionName, mess) {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        }
        else {
            var dbo = db.db(defineVal.dbUser + username);
            var newMess = {
                sender: collectionName,
                textMess: mess,
                created: new Date()
            };
            dbo.collection(collectionName).insertOne(newMess, function (err, res) {
                if (err) throw err;
                else {
                    console.log("1 message was saved in db of " + username);
                    db.close();
                }
            });

        }
    });
}

function saveMessImageBase64Sender(username, collectionName, mess) {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        }
        else {
            var dbo = db.db(defineVal.dbUser + username);
            var newMess = {
                sender: username,
                imgBase64: mess,
                created: new Date()
            };
            dbo.collection(collectionName).insertOne(newMess, function (err, res) {
                if (err) throw err;
                else {
                    console.log("1 img message was saved in db of " + username);
                    db.close();
                }
            });

        }
    });
}

function saveMessImageBase64Giver(username, collectionName, mess) {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
        if (err) {
            throw err;
        }
        else {
            var dbo = db.db(defineVal.dbUser + username);
            var newMess = {
                sender: collectionName,
                imgBase64: mess,
                created: new Date()
            };
            dbo.collection(collectionName).insertOne(newMess, function (err, res) {
                if (err) throw err;
                else {
                    console.log("1 img message was saved in db of " + username);
                    db.close();
                }
            });

        }
    });
}

function readDatabaseMessage(dbName,chatWithUser, messagePagesNumber) {
    //access db to get messages of this user
    var collectionName = chatWithUser;
    return new Promise(function (resolve) {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                resolve({ resultType: false });
                throw err;
            }
            else {
                var dbo = db.db(dbName);
                dbo.collection(collectionName).find({}).limit(10 * messagePagesNumber).sort({ "created": -1 }).toArray(function (err, data) {
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

module.exports = {
    saveMessTxtRoom: saveMessTxtRoom,
    saveMessImageBase64Room: saveMessImageBase64Room,
    saveMessTxtSender: saveMessTxtSender,
    saveMessTxtGiver: saveMessTxtGiver,
    saveMessImageBase64Sender: saveMessImageBase64Sender,
    saveMessImageBase64Giver: saveMessImageBase64Giver,
    readDatabaseMessage: readDatabaseMessage
}