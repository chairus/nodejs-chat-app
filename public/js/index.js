var socket = io();   // Initiate request from client to server to open up a web socket and keep it open

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = $('<li></li>');
    li.text(`${ message.from } ${ formattedTime }: ${ message.text }`)

    $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');

    li.text(`${ message.from } ${ formattedTime }: `);
    a.attr('href', message.url);

    li.append(a);
    $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {    // This callback function is called once the client received acknowledgement from server
        messageTextbox.val('');
    });
})

var locationButton = $('#btn-send-location');

locationButton.on('click', function(e) {
    if (!'geolocation' in navigator) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', true).html('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttr('disabled').html('Send location');
    }, function () {
        alert('Unable to fetch location.');
        locationButton.removeAttr('disabled').html('Send location');
    });
});
