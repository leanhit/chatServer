let defineVal = require('./defineValue');
let MongoClient = require('mongodb').MongoClient;

function createRoom(member, roomInfo) {
  let roomID = roomInfo.roomID
  let roomName = roomInfo.roomName;
  let roomMembers = roomInfo.roomMembers;
  
  MongoClient.connect(defineVal.baseUrl, function (err, db) {
    if (err) {
      throw err;
    } else {
      const dbName = defineVal.dbUser + member;
      let dbo = db.db(dbName);

      //add room to chat list 
      dbo.collection(defineVal.chatListCollection).findOne({ nameID: member }, function (err, user) {
        if (err) {
          throw err;
        }
        else {
          if (user == null) {  //can't find the username      
            let newChater = {
              nameID: roomID,
              realName: roomName,
              members: roomMembers,
              lastChat: new Date(),
              created: new Date()
            };
            console.log(newChater)
            dbo.collection(defineVal.chatListCollection).insertOne(newChater, function (err, res) {
              if (err) throw err;
              else {
                console.log("1 room inserted to " + member + " chatList");

                db.close();
              }
            });
          } else {//find out
            dbo.collection(defineVal.chatListCollection).findOneAndUpdate({ nameID: roomID }, { $set: { members: roomMembers } }, function (err, res) {
              if (err) throw err;
              else {
                console.log("1 room updated");
                db.close();

              }
            });

          }
        }
      });
    }
  });


}

function updateRoomMember(roomID, member, membersList) {
  let dbName = defineVal.dbUser + member;
  MongoClient.connect(defineVal.baseUrl, function (err, db) {
    let dbo = db.db(dbName);

    dbo.collection(defineVal.chatListCollection).findOneAndUpdate({ nameID: roomID }, { $set: { members: membersList } }, function (err, res) {
      if (err) throw err;
      else {
        console.log("room " + roomID + " of " + member + " updated");
        db.close();
      }
    });
  });
}

function insertRoomToChatList(usname, roomInfo) {
  let roomID = roomInfo.roomID;
  let roomName = roomInfo.roomName;
  let roomMembers = roomInfo.members;

  MongoClient.connect(defineVal.baseUrl, function (err, db) {
    if (err) {
      throw err;
    } else {
      const dbName = defineVal.dbUser + usname;
      let dbo = db.db(dbName);

      //add room to chat list         
      let newChater = {
        nameID: roomID,
        roomName: roomName,
        members: roomMembers,
        lastChat: new Date(),
        created: new Date()
      };
      dbo.collection(defineVal.chatListCollection).insertOne(newChater, function (err, res) {
        if (err) throw err;
        else {
          console.log("1 room inserted to " + usname + " chatList");
          db.close();
        }
      });
    }
  });
}

function updateRoomName(roomID, member, newRoomName) {
  let dbName = defineVal.dbUser + member;
  MongoClient.connect(defineVal.baseUrl, function (err, db) {
    let dbo = db.db(dbName);

    dbo.collection(defineVal.chatListCollection).findOneAndUpdate({ nameID: roomID }, { $set: { roomName: newRoomName } }, function (err, res) {
      if (err) throw err;
      else {
        console.log("room " + roomID + " of " + member + " updated");
        db.close();
      }
    });
  });
}

module.exports = {
  updateRoomMember: updateRoomMember,
  updateRoomName: updateRoomName,
  insertRoomToChatList: insertRoomToChatList,
  createRoom: createRoom
};