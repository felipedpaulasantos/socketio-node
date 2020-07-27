const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var count = 0;

app.get('/', (req, res) => {
	res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
	console.log('a user connected');

	var teste = setInterval(() => {
		io.emit('my broadcast', `${count}`);
		count = count + 1;
	}, 3000);

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('my message', (msg) => {    
		console.log('message: ' + msg);  
	});
});

http.listen(process.env.PORT || 5000, () => {
	console.log('listening on *:3000');
});