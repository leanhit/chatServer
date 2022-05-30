var bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
var defineVal = require('./defineValue');

//get login event
function loginToMongoDB(info) {
    const username = info?.username;
    var psw = info?.password;
    return new Promise(function (resolve) {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                resolve({
                    resultType: false,
                    resultContent: defineVal.loginInvalidDb
                });
                throw err;
            } else {
                var dbo = db.db(defineVal.dbAllUser);
                dbo.collection(defineVal.userColection).findOne({ username: username }, function (err, user) {
                    if (err) {
                        resolve({
                            resultType: false,
                            resultContent: defineVal.loginInvalidDb
                        });
                        throw err;
                    } else {
                        if (user == null) {
                            //result verification to client: invalid username
                            resolve({
                                resultType: false,
                                resultContent: defineVal.loginInvalidUsername
                            });
                        } else {
                            var hash = user.password;
                            bcrypt.compare(psw, hash, function (err, result) {
                                if (result) {
                                    resolve({
                                        resultType: true,
                                        resultContent: username
                                    });
                                } else {
                                    //result verification to client: invalid password
                                    resolve({
                                        resultType: false,
                                        resultContent: defineVal.loginInvalidPassword
                                    });
                                }
                            });
                        }
                        db.close();
                    }
                });
            }
        });

    });
}

function getChatList(username) {
    return new Promise(function (resolve) {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                resolve({ resultType: false });
                throw err;
            }
            else {
                const dbName = defineVal.dbUser + username;
                var dbo = db.db(dbName);

                dbo.collection(defineVal.chatListCollection).find({}).sort({ "lastChat": -1 }).toArray(function (err, data) {
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

function findUser(username) {
    return new Promise(function (resolve) {
        //check userfindUserResultname exit
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                resolve({
                    resultType: false
                });
                throw err;
            }
            else {
                var dbo = db.db(defineVal.dbAllUser);
                dbo.collection(defineVal.userColection).findOne({ username: username }, function (err, user) {
                    if (err) {
                        resolve({
                            resultType: false
                        });
                        throw err;
                    }
                    else {
                        if (user == null) {  //can't find the username            
                            //result verification to client
                            resolve({
                                resultType: false
                            });
                        } else {//find out
                            resolve({
                                resultType: true,
                                resultContent: user.username
                            });
                        }
                        db.close();
                    }
                });

            }

        });
    });

}

function deleteUserDB(dbName, user) {
    return new Promise(function (resolve) {
        var collectionName = user;
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                resolve (false);
                throw err;
        }
            var dbo = db.db(dbName);
            dbo.collection(collectionName).drop(function (err, delOK) {
                if (err){
                    resolve(false);
                     throw err;
                }
                if (delOK) {
                    console.log("Collection deleted");

                    dbo.createCollection(collectionName, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            db.close();
                        }
                    });
                    resolve(true);
                }
            });
        });
    });

}

//get event registry
function userRegistry(info) {
    var usn = info.username;
    var psw = info.password;

    //catch err database
    if (defineVal.checkValidUsername(usn)) {
        //check username exit
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                throw err;
            }
            else {
                var dbo = db.db(defineVal.dbAllUser);
                dbo.collection(defineVal.userColection).findOne({ username: usn }, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    else {
                        if (user != null) {
                            //result verification to client
                            client.emit('registryResult', false);
                        } else {
                            //hash password
                            const saltRounds = 10;
                            bcrypt.genSalt(saltRounds, function (err, salt) {
                                bcrypt.hash(psw, salt, function (err, hash) {
                                    //add new user to dbAllUser
                                    var newUser = {
                                        username: usn,
                                        password: hash,
                                        created: new Date()
                                    };
                                    dbo.collection(defineVal.userColection).insertOne(newUser, function (err, res) {
                                        if (err) {
                                            throw err;
                                        }
                                        else {
                                            /*/result verification to client
                                            client.emit('registryResult', true);

                                            //create user default database
                                            images.createAvatarDefault(usn);
                                            dbAccess.createdDefaultUserDB(usn);*/

                                            db.close();
                                        }
                                    });

                                });
                            });

                        }
                    }
                });
            }
        });

    }

}


module.exports = {
    userRegistry: userRegistry,
    userLogin: loginToMongoDB,
    getChatList: getChatList,
    findUser: findUser,
    deleteUserDB: deleteUserDB,

}