const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const users = [
  { username: 'John', online: false },
  { username: 'Josh', online: false },
  { username: 'Joy', online: false },
  { username: 'Joe', online: false },
  { username: 'Jole', online: false },
  { username: 'Joff', online: false },
  { username: 'Joke', online: false },
  { username: 'Jote', online: false },
  { username: 'Jolly', online: false },
  { username: 'Joi', online: false },
];

io.on('connection', (socket) => {
  socket.on('login', (username) => {
    const user = users.find((user) => user.username === username);
    if (user) {
      user.online = true;
      io.emit('updateUsers', users);
    }
  });

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    const user = users.find((user) => user.socketId === socket.id);
    if (user) {
      user.online = false;
      io.emit('updateUsers', users);
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});