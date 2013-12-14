// Declaring our Libraries
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	usernames = []; // Needed to keep track of all the users

// Allows us to serve static files from our public directory
app.use(express.static(__dirname + '/public'));

// Telling the server what port to listen to
server.listen(3000);

// Setting up Routes
app.get('/', function(request, response) {
	response.sendfile(__dirname + '/index.html');
});

// Managing our socket connections
io.sockets.on('connection', function(socket) {

	// Socket event for creating a user, checks to see if a username is taken
	// and returning a callback with the response
	socket.on('create_user', function(data, callback) {
		if (usernames.indexOf(data) != -1) {
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
		}
	});

	// Helper method for updating our list of usernames on the client-side
	function updateUsernames() {
		io.sockets.emit('usernames', usernames);
	}

	// Socket event for sending a question
	socket.on('send_question', function(data) {
		io.sockets.emit('new_question', {question: data, username: socket.username});
	});

	socket.on('disconnect', function(data) {
		if (!socket.username)
			return;
		usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames();
	});
});