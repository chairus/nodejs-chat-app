const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const routes = require('../routes/index');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var { generateMessage } = require('./utils/message')

app.use(express.static(path.join(__dirname, '../public')));

app.use(routes);

/* Register an event listener to listen for specific events and do something if an event occurs. */
io.on('connection', (socket) => { // In this case we are listening for events that wants to connect to the server
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has joined'));

    socket.on('createMessage', (newMessage) => {
        console.log('New message received:', newMessage);
        /*
            NOTE: socket.emit() only emit/send messages to only one specific connection, whereas
                  io.emit() send messages to all clients that are currently connected to the server,
                  including the client that emitted the event. However, socket.broadcast.emit() works
                  similarly to io.emit() but it doesn't send the emitted message to the sender. In other
                  words the server only emits the event to all connected clients except the client that
                  emitted the event.
         */
        io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
        // socket.broadcast.emit('newMessage', {
        //     from: newMessage.from,
        //     text: newMessage.text,
        //     createdAt: new Date().toDateString()
        // });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server has started. Listening on PORT ${port}`);
});
