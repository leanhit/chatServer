let defineVal = require('./defineValue');
//modul process mssql
let mssql = require("mssql");
const { avatarDefault } = require('./images');
// config for your mssql database
let config = {
    user: 'sa',
    password: 'VdcVNH2020@$#',
    server: 'WIN-VNN\\SQLEXPRESS',
    database: 'web_vnn',
    stream: false,
    options: {
        trustedConnection: true,
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
};

//get event find an user
function findUserMssql(username) {
    //catch err database
    if (username) {
        let usname = username;
        return new Promise(function (resolve) {
            // connect to your database
            mssql.connect(config, function (err) {
                if (err) {
                    resolve({
                        resultType: false
                    });
                    throw err;
                }
                else {
                    // create Request object
                    let request = new mssql.Request();

                    // query to the database and get the records
                    const usnameQuery = 'select * from Users where Username = \'' + usname + '\'';

                    request.query(usnameQuery, function (err, dataResult) {
                        if (err) {
                            resolve({
                                resultType: false
                            });
                            throw err;
                        }
                        else {
                            if (dataResult.rowsAffected == 0) {  //can't find the username            
                                //result verification to client
                                resolve({
                                    resultType: false
                                });
                            }
                            else { //find out
                                resolve({
                                    resultType: true,
                                    resultContent: usname
                                });
                            }
                        }
                    });
                }
            });
        });
    }

}

//get login to mssql event
function loginToMssqlDB(info) {
    let username = info?.username;
    let psw = info?.password;

    if (defineVal.checkValidUsername(username)) {
        return new Promise(function (resolve) {
            // connect to your database
            mssql.connect(config, function (err) {
                if (err) {
                    resolve({
                        resultType: false,
                        resultContent: defineVal.loginInvalidDb
                    });
                    throw err;
                }
                else {
                    // create Request object
                    let request = new mssql.Request();

                    // query to the database and get the records
                    const usnameQuery = 'select * from Users where Username = \'' + username + '\'';

                    request.query(usnameQuery, function (err, dataResult) {
                        if (err) {
                            resolve({
                                resultType: false,
                                resultContent: defineVal.loginInvalidDb
                            });
                        }
                        else {
                            if (dataResult.rowsAffected == 0) {
                                //result verification to client: invalid username
                                resolve({
                                    resultType: false,
                                    resultContent: defineVal.loginInvalidUsername
                                });
                            }
                            else {
                                let userID = dataResult.recordset[0].UserID
                                const pawordQuery = 'select * from BEN_Members where UserID = \'' + userID + '\'';
                                request.query(pawordQuery, function (err, result) {
                                    if (err) {
                                        resolve({
                                            resultType: false,
                                            resultContent: defineVal.loginInvalidDb
                                        });
                                        throw err;
                                    }
                                    else {
                                        if (result.recordset[0].PassWord == psw) {
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
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });
    }
}

module.exports = {
    findUser: findUserMssql,
    userLogin: loginToMssqlDB
}