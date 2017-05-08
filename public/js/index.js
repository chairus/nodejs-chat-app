var socket = io();   // Initiate request from client to server to open up a web socket and keep it open

socket.on('connect', function() {
    console.log('Connected to server');

    socket.emit('createMessage', {
        from: 'cyrus@example.com',
        text: 'Sure, I\'d love to'
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('New message', message);
});
