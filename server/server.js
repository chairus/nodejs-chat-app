const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const routes = require('../routes/index');
const {isRealString} = require('./utils/validation');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var {generateMessage, generateLocationMessage} = require('./utils/message')
const {Users} = require('./utils/users');
var users = new Users();

app.use(express.static(path.join(__dirname, '../public')));

app.use(routes);

/* Register an event listener to listen for specific events and do something if an event occurs. */
io.on('connection', (socket) => { // In this case we are listening for events that wants to connect to the server
    console.log('New user connected');

    socket.emit('updateRoomList', users.getRoomList());

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        // Check for duplicate name in the same room
        var dupName = users.getUserList(params.room).find((user) => user.toLowerCase() === params.name.toLowerCase());
        if (dupName) {
            return callback('Name is already in use.');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });

    socket.on('createMessage', (newMessage, callback) => {
        console.log('New message received:', newMessage);
        var user = users.getUser(socket.id);
        /*
            NOTE: socket.emit() only emit/send messages to only one specific connection, whereas
                  io.emit() send messages to all clients that are currently connected to the server,
                  including the client that emitted the event. However, socket.broadcast.emit() works
                  similarly to io.emit() but it doesn't send the emitted message to the sender. In other
                  words the server only emits the event to all connected clients except the client that
                  emitted the event.
         */

        if (user && isRealString(newMessage.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, newMessage.text));
        }
        callback(); // Send acknowledgement to the client that the server has successfully received the message
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        var user = users.removeUser(socket.id);

        if (user) {
            socket.broadcast.to(user.room).emit('updateUserList', users.getUserList(user.room));
            socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }

    });
});

server.listen(port, () => {
    console.log(`Server has started. Listening on PORT ${port}`);
});
