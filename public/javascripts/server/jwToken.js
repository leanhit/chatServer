const MongoClient = require('mongodb').MongoClient;
var jwt = require('jsonwebtoken');
var defineVal = require('./defineValue');

const scretKeyToken = 'thisisscretkeyoftoken1';
const scretKeyFreshToken = 'thisisscritkerofrefreshtoken';
const tokenLife = 24 * 60 * 60; // 1 day
const refreshTokenlife = 30 * 24 * 60 * 60;//1 month

function decodeToken(jwtoken) {
  // decode token
  return new Promise(function (resolve, reject) {
    jwt.verify(jwtoken, scretKeyToken, function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

function decodeRefreshToken(jwtoken) {
  // decode token
  return new Promise(function (resolve, reject) {
    jwt.verify(jwtoken, scretKeyFreshToken, (err, decoded) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        //console.log(decoded);
        resolve(decoded);
      }
    });
  });
}

function encodeToken(usname) {
  const payload = {
    username: usname
  };

  var token = jwt.sign(payload, scretKeyToken, {
    expiresIn: tokenLife
  });

  return token;
}

function encodeRefreshToken(usname, psword) {
  const payloadRT = {
    password: psword,
    username: usname
  };

  var token = jwt.sign(payloadRT, scretKeyFreshToken, {
    expiresIn: refreshTokenlife
  });

  return token;
}

//get login by jsonwebtoken
function loginByJwt(jwtoken) {
  return new Promise(function (resolve) {
    jwt.verify(jwtoken, scretKeyToken, function (err, decoded) {
      if (err) {
        resolve({
          resultType: false,
          resultContent: defineVal.jwtExpired
        });
        throw err;
      } else {
        if (typeof (decoded) !== 'undefined') {
          resolve({
            resultType: true,
            resultContent: decoded?.username
          });
        }
      }
    });
  });

}

function saveRefreshToken(username, refreshToken) {
  MongoClient.connect(defineVal.baseUrl, function (err, db) {
    if (err) {
      throw (err);
    } else {
      const dbName = defineVal.dbUser + username;
      var dbo = db.db(dbName);
      var newToken = {
        refreshToken: refreshToken,
        created: new Date()
      };
      dbo.collection(defineVal.refreshTokenCollection).insertOne(newToken, function (err, res) {
        if (err) {
          throw (err);
        } else {
          console.log("new refresh token inserted to database of: " + username);
        }
        db.close();
      });
    }
  });

}

function getRefreshToken(usname) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(defineVal.baseUrl, function (err, db) {
      if (err) {
        reject(err);
      }
      else {
        const dbName = defineVal.dbUser + usname;
        var dbo = db.db(dbName);
        dbo.collection(defineVal.refreshTokenCollection).findOne({}, function (err, user) {
          if (err) {
            reject(err);
          }
          else {
            resolve(user?.refreshToken);
            //resolve(user);
          }
          db.close();
        });
      }

    });
  });
}

module.exports = {
  scretKeyToken: scretKeyToken,
  scretKeyFreshToken: scretKeyFreshToken,
  tokenLife: tokenLife,
  refreshTokenlife: refreshTokenlife,

  encodeToken: encodeToken,
  decodeToken: decodeToken,
  encodeRefreshToken: encodeRefreshToken,
  decodeRefreshToken: decodeRefreshToken,

  saveRefreshToken: saveRefreshToken,
  getRefreshToken: getRefreshToken,


  userLogin: loginByJwt

}





/*
var jwt = require('jsonwebtoken');
var atob = require('atob');

const scretKeyToken = 'thisisscretkeyoftoken1';
const scretKeyFressToken = 'thisisscritkerofrefresstoken';
const tokenLife = 2*60; //2 min
const refressTokenlife = 7*27*60*60;//1week

function decodeTokenPromise(token){
  // decode token
  return new Promise(function(resolve, reject){

      //this way use callback
      // verifies secret and checks exp        
      jwt.verify(jwtoken, scretKey, (err, decoded) =>{      
        if (err) {
          //console.log('Failed to authenticate token.');
          //client.emit('loginByJwtResult', false);
          reject(err);
        } else {
          // if everything is good, save to request for use in other routes
          //client.emit('loginByJwtResult', decoded.username);
          resolve(decoded.username);
          
        }
      });
  
    });
}

 function decodeToken(token){
    // decode token
    if (token) {
        return JSON.parse(atob(token.split('.')[1]));

        /*this way use callback
        // verifies secret and checks exp        
        jwt.verify(jwtoken, scretKey, (err, decoded) =>{      
          if (err) {
            console.log('Failed to authenticate token.');
            client.emit('loginByJwtResult', false);
          } else {
            // if everything is good, save to request for use in other routes
            client.emit('loginByJwtResult', decoded.username);
            
          }
        });
    
      } else {
    
        // if there is no token
        // return an error
        return null;
      }
}

function decodeRefressToken(token){
  // decode token
  if (token) {
      return JSON.parse(atob(token.split('.')[1]));
    } else {
  
      // if there is no token
      // return an error
      return null;
    }
}

function encodeToken(usname){    
  const payload = {
      username: usname
    };

    var token = jwt.sign(payload, scretKeyToken, {
      expiresIn: tokenLife
    });

    return token;
}

function encodeRefressToken(usname){    
  const payload = {
      username: usname
    };

    var token = jwt.sign(payload, scretKeyFressToken, {
      expiresIn: refressTokenlife
    });

    return token;
}


module.exports.scretKeyToken = scretKeyToken;
module.exports.scretKeyFressToken = scretKeyFressToken;
module.exports.tokenLife = tokenLife;
module.exports.refressTokenlife = refressTokenlife;

module.exports.encodeToken = encodeToken;
module.exports.encodeRefressToken = encodeRefressToken;
module.exports.decodeToken = decodeToken;
module.exports.decodeRefressToken = decodeRefressToken;
*/