var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require("body-parser");

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
	var name = req.body.name;
	var room = req.body.room;
	console.log(name + " " + room);
});

app.get('/:room', function(req, res) {
	res.sendFile(__dirname + '/chat.html');
	
});

io.on('connection', function(socket) {
	console.log('a user connected');
	
	console.log(socket);
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
		console.log('message: ' + msg);
	});
	
	socket.on('disconnect', function(msg) {
		console.log('user disconnected');
	});
});

http.listen(3000, function(){
 	console.log('listening on localhost:3000');
});