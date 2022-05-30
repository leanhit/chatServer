const fs = require('fs');
const avatarDefault = __dirname + "/../../images/default/defaultAvatar.png";
const local = __dirname + "/../../images/avatar/";

function randomString(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getBase64Image(imgData) {
return imgData.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
}

function getExtraFilename(imgData){
    var guess = imgData.match(/^data:image\/(png|jpeg);base64,/)[1];
    
    var ext = "";
    switch(guess) {
        case "png"  : ext = ".png"; break;
        case "jpeg" : ext = ".jpg"; break;
        default     : ext = ".bin"; break;
    }
    return ext;
}

function creteFilename(imgData){
    return randomString(10) + getExtraFilename(imgData);
}

function getFolder(name){
    var path = "";
    var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x' ,'y' ,'z'];

    var firstChar = name.substr(0,1);
    var index = alphabet.indexOf(firstChar);
    if (0 <= index && index <= 7){
        return "atoh/";
    }
    else if (8 <= index && index <= 15){
        return "itop/";
    }
    else if (16 <= index && index <= 25){
        return "qtoz/";
    }
    else{
        return "other/";
    }
}

//get local store avatar via username to write
function getAvatarLocal(username){
    return local + getFolder(username);
}

function createAvatarDefault(username){
    var newPath = getAvatarLocal(username) + username + "_avatar.png";

    // destination will be created or overwritten by default.
    fs.copyFile(avatarDefault, newPath, (err) => {
        if (err) throw err;
    //        console.log('File was copied to destination');
    });
}



function copyAvatar(sourcePath, destPath){
    // destination will be created or overwritten by default.
    fs.copyFile(sourcePath, destPath, (err) => {
        if (err) throw err;
    //        console.log('File was copied to destination');
    });
}

function deleteAvatar(avatarPath){
    fs.unlink(avatarPath, function(err){
        if (err) {
            console.log(err);
        } else {
            
        }
    });   
}

function writeImageCallback(uri, imgBase64){
    //write image to local
    fs.writeFile(uri, imgBase64, 'base64', function(err) {
        if (err){
            console.log(err);
        }
        else{                             
                                            
        }
    });
}

function readFile(fileName) {
    return new Promise(resolve => {
      //console.log(test);
      fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) throw err;
  
        console.log(fileName)
        console.log(data)
      })
      resolve();
    });
  }

function writeImageCore(uri, imgBase64){
    new Promise(resolve => {
        //console.log(test);
        fs.writeFile(uri, imgBase64, 'base64', function(err) {
            if (err){
                console.log(err);
            }
            else{                             
                                                
            }
        });
        resolve();
    });
}

    async function writeImage(uri, imgBase64) {
        await writeImageCore(uri, imgBase64);
        
      }

function updateAvatar(usname, avatar){
    var savedFilename = usname + "_avatar.png";
    
    var imgBase64 = getBase64Image(avatar.base64);

    var uri = local + getFolder(usname) + savedFilename;  
    
    //write image to local
    writeImageCallback(uri, imgBase64);
    
}



module.exports.avatarDefault = avatarDefault;
module.exports.getAvatarLocal = getAvatarLocal;
module.exports.createAvatarDefault = createAvatarDefault;
module.exports.copyAvatar = copyAvatar;
module.exports.deleteAvatar = deleteAvatar;
module.exports.getExtraFilename = getExtraFilename;
module.exports.updateAvatar = updateAvatar;

module.exports.creteFilename = creteFilename;
module.exports.getBase64Image = getBase64Image;
module.exports.writeImageCallback = writeImageCallback;
module.exports.writeImage = writeImage;
module.exports.randomString = randomString;