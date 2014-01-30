var io = require('socket.io').listen(4242);
io.set('log level',1);

var Player = require('./player.js');
var players = {};

var gameIsOn = false;

io.sockets.on('connection', function (socket) {

	for (var playerId in players){
		socket.emit('updatePlayer', players[playerId])
	}

	var newPlayer = new Player(socket.id);
	players[socket.id] = newPlayer;
	io.sockets.emit('updatePlayer', newPlayer);

	socket.on('setUsername', function (username) {
		players[socket.id].setUsername(username);
		io.sockets.emit('updatePlayer', players[socket.id]);
	});

	if (gameIsOn) io.sockets.emit('beginGame',{});

	socket.on('disconnect', function () {
		delete players[socket.id];
		socket.broadcast.emit('deletePlayer', socket.id);
	});

	socket.on('hitIt', function () {
		if (gameIsOn){
			gameIsOn = false;
			io.sockets.emit('endGame');
			players[socket.id].getOnePoint();
			io.sockets.emit('updatePlayer', players[socket.id]);

			setTimeout(function () {
				gameIsOn = true;
				io.sockets.emit('beginGame',null);
			},
			Math.random()*5000);
		}
		else {
			players[socket.id].loseOnePoint();
			io.sockets.emit('updatePlayer', players[socket.id]);
		}
	});
});

setTimeout(function () {
	gameIsOn = true;
	io.sockets.emit('beginGame',null);
},
Math.random()*5000);