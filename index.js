const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var count = 0;
var updatedCount = 0;
var lastMessage = "App funcionando!"

var teste = setInterval(() => {
	if (count == 100) { count = 0; }
	io.emit('my broadcast', `${count}`);
	count = count + 1;
}, 3000);

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('reset', () => {
		console.log("Resetando...");
		count = 0;
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('update', (udpate) => {    
		updatedCount = udpate;
		console.log(udpate);  
	});

	socket.on('message', (msg) => {    
		lastMessage = msg;
		console.log(msg);  
	});
});

app.get('/', (req, res) => {
	res.send(`<h1>${updatedCount} ${lastMessage}</h1>`);
});

http.listen(process.env.PORT || 3000, () => {
	console.log('listening on *:3000');
});