// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 2000);
app.use(express.static(__dirname + '/client'));
//app.use(express.static(__dirname + '/style.css'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/client/index.html'));
});

// Starts the server.
server.listen(2000, function() {
  console.log('Starting server on port 2000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
