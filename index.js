const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var count = 0;
var updatedCount = 0;
var lastMessage = "App funcionando!"

const EVENTO_MENSAGEM = "message";

var teste = setInterval(() => {
	if (count == 100) { count = 0; }
	io.emit('my broadcast', `${count}`);
	count = count + 1;
}, 3000);

io.on('connection', (socket) => {
	console.log('a user connected');

	io.emit('message', `Conectado!`);

	socket.on('reset', () => {
		console.log("Resetando...");
		count = 0;
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('update', (udpate) => {    
		updatedCount = udpate;
	});

  socket.on(EVENTO_MENSAGEM, (msg) => {
		lastMessage = msg;
    io.emit('message', msg);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/* app.get('/', (req, res) => {
	res.send(`<h1>${updatedCount} ${lastMessage}</h1>`);
}); */

app.post('/mensagem', function (req, res, next) {
	console.log(req.body);
	io.emit(EVENTO_MENSAGEM, req.body.mensagem);
  res.json(req.body);
})

http.listen(process.env.PORT || 3000, () => {
	console.log('listening on *:3000');
});