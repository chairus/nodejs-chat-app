var socket = io(); // Initiate request from client to server to open up a web socket and keep it open

function scrollToBottom() {
    // Selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if ((clientHeight + scrollTop + newMessageHeight + lastMessageHeight) >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    var params = $.deparam(window.location.search);
    params.room = params.room.toLowerCase(); // Making sure that room name are case insensitive

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {}
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    var ul = $('<ul></ul>');

    users.forEach((user) => {
        ul.append($('<li></li>').html(user))
    });

    $('#users').html(ul);
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
    scrollToBottom();
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
    scrollToBottom();
});

$('#message-form').on('submit', function(e) {
    e.preventDefault();

    var messageTextbox = $('[name=message]');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function() { // This callback function is called once the client received acknowledgement from server
        messageTextbox.val('');
    });
})

var locationButton = $('#btn-send-location');

locationButton.on('click', function(e) {
    if (!'geolocation' in navigator) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', true).html('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttr('disabled').html('Send location');
    }, function() {
        alert('Unable to fetch location.');
        locationButton.removeAttr('disabled').html('Send location');
    });
});
