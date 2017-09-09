var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;

var rooms = [];
var maxPerson = 2;
for (var i = 0; i < 50; i++) {
  rooms.push({ id: i, numPeople: 0 });
}

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/design.html");
});

app.use(express.static("css"));

io.on("connection", function(socket) {
  // Handles chat messages to rooms
  socket.on("chat message", function(msg) {
    console.log(msg);
    io.to(socket.room).emit("chat message", msg);
  });

  // Adds user to room
  socket.on("adduser", function(name) {
    console.log("adding " + name);
    socket.name = name;

    var room = findRoom();

    if (room === null) {
      console.log("ROOMS ARE FULL!!");
    }

    socket.room = room.id;
    socket.join(room.id);
    socket.emit("room", room.id);

    console.log(rooms);
  });

  socket.on("disconnect", function() {
    socket.leave(socket.room);
    if (rooms[socket.room]) rooms[socket.room].numPeople--;
    console.log(rooms);
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});

function printRooms() {
  for (var i = 0; i < 50; i++) {
    console.log(rooms[i]);
  }
}
function findRoom() {
  for (var i = 0; i < 50; i++) {
    if (rooms[i].numPeople < maxPerson) {
      rooms[i].numPeople++;
      return rooms[i];
    }
  }
}
