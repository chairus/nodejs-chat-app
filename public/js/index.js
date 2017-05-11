var socket = io();   // Initiate request from client to server to open up a web socket and keep it open

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        timestamp: formattedTime
    });

    $("#messages").append(html);
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var locationTemplate = $('#location-message-template').html();
    var html = Mustache.render(locationTemplate, {
        timestamp: formattedTime,
        url: message.url,
        from: message.from
    });

    $('#messages').append(html);
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
