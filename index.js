// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://expertwebdeveloper.com',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leaveConversation', (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on('sendMessage', (message) => {
    // Save the message to the database
    io.to(message.conversationId).emit('receiveMessage', message);
  });

  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('userTyping', data);
  });
});

server.listen(3000, () => {
  console.log('Socket.IO server is running on port 3000');
});
