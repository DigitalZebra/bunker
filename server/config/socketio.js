var ios = require('socket.io-express-session');
var routes = require('./routes');
var User = require('../models/User');

var socketio = module.exports;

socketio.connect = function (server) {
	var session = require('./auth').session;
	var io = require('socket.io')(server);
	socketio.io = io;

	io.use(ios(session));
	io.on('connection', function (socket) {
		routes.socketio(socket);
		socket.on('disconnect', function () {
			afterDisconnect(socket);
		});
	});

	// get all the sockets connected to a room
	io.inRoom = function findClientsSocketByRoomId(roomId) {
		return _.map(_.keys(io.sockets.adapter.rooms[roomId]), function (id) {
			return io.sockets.adapter.nsp.connected[id];
		});
	};

	return io;
};


function afterDisconnect(socket) {
	User.findOne({sockets: socket.id}).then(function (user) {
		if (!user) return;
		user.sockets = _.without(user.sockets, socket.id);
		user.connected = user.sockets.length > 0;
		user.lastConnected = new Date().toISOString();
		user.typingIn = null;
		return user.save();
	});
}
