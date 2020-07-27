const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var count = 0;
var updatedCount = "App funcionando!";

io.on('connection', (socket) => {
	console.log('a user connected');

	var teste = setInterval(() => {
		if (count == 100) { count = 0; }
		io.emit('my broadcast', `${count}`);
		count = count + 1;
	}, 3000);

	socket.on('reset', () => {
		console.log("Resetando...");
		count = 0;
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('my message', (msg) => {    
		updatedCount = msg;
		console.log(msg);  
	});
});

app.get('/', (req, res) => {
	res.send(`<h1>${updatedCount}</h1>`);
});

http.listen(process.env.PORT || 3000, () => {
	console.log('listening on *:3000');
});