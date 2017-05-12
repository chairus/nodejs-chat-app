var socket = io(); // Initiate request from client to server to open up a web socket and keep it open

socket.on('updateRoomList', function(rooms) {
    if (rooms.length > 0) {
        var datalist = $('<datalist></datalist>');
        datalist.attr('id', 'rooms');

        rooms.forEach((room) => {
            datalist.append($('<option>').attr('value', room));
        })

        $('form div:nth-child(3)').append(datalist);
    }
});
