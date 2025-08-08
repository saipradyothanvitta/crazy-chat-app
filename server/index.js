const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    const { username, room } = data;
    socket.join(room);
    socket.username = username;
    socket.room = room;
    socket.userId = socket.id;

    if (!rooms[room]) {
      rooms[room] = [];
    }
    rooms[room].push({ id: socket.id, username });

    const joinNotification = {
      type: 'notification',
      message: `Welcome to Room ${room}, ${username}!`
    };
    socket.emit('receive_message', joinNotification);

    const othersNotification = {
      type: 'notification',
      message: `${username} has joined the chat.`
    };
    socket.to(room).emit('receive_message', othersNotification);

    io.to(room).emit('room_data', {
      userCount: rooms[room].length,
      users: rooms[room].map(u => u.username)
    });
  });

  socket.on('send_message', (data) => {
    // Add sender's socket ID for status updates
    data.senderId = socket.id;
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('message_delivered', (data) => {
    io.to(data.senderId).emit('update_message_status', {
      messageId: data.messageId,
      status: 'delivered'
    });
  });

  socket.on('messages_read', (data) => {
    socket.to(data.room).emit('update_read_status', { readerId: socket.id });
  });

  socket.on('typing', (data) => {
    socket.to(data.room).emit('typing_status', `${data.username} is typing...`);
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.room).emit('typing_status', '');
  });

  socket.on('disconnect', () => {
    const { username, room } = socket;
    if (username && room && rooms[room]) {
      console.log(`User ${username} (${socket.id}) left room: ${room}`);
      rooms[room] = rooms[room].filter((user) => user.id !== socket.id);

      const leaveNotification = {
        type: 'notification',
        message: `${username} has left the chat.`
      };
      socket.to(room).emit('receive_message', leaveNotification);

      io.to(room).emit('room_data', {
        userCount: rooms[room].length,
        users: rooms[room].map(u => u.username)
      });
    }
    console.log('User Disconnected', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
