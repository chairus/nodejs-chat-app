const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const routes = require('../routes/index');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);  //

app.use(express.static(path.join(__dirname, '../public')));

app.use(routes);

/* Register an event listener to listen for specific events and do something if an event occurs. */
io.on('connection', (socket) => { // In this case we are listening for events that wants to connect to the server
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server has started. Listening on PORT ${port}`);
});
