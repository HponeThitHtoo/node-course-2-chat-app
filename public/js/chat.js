var socket = io();

socket.on('connect', function() {
    // console.log('Connected to server');

    /* socket.emit('createEmail', {
        to: 'jen@example.com',
        text: 'Hey. This is Andrew.'
    }); */

    /* socket.emit('createMessage', {
        from: 'Andrew',
        text: 'Yup, that works for me.'
    }); */

    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        // console.log('Should scroll');
        messages.scrollTop(scrollHeight);
    }
}

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

/* socket.on('newEmail', function(email) {
    console.log('New email', email);
}); */

socket.on('updateUserList', function(users) {
    // console.log('Users list', users);

    var ol = document.createElement('ol');

    users.forEach(function(user) {
        var li = document.createElement('li');
        var text = document.createTextNode(user);
        li.appendChild(text);
        ol.appendChild(li);
    });

    var users = document.querySelector('#users');
    users.innerHTML = '';
    users.appendChild(ol);
});

socket.on('newMessage', function(message) {
    // console.log('New Message', message);

    /* var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} (${formattedTime}): ${message.text}`);
    jQuery('#messages').append(li); */

    var formattedTime = moment(message.createdAt).format('h:mm a');

    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);

    scrollToBottom();
});

// Event Acknowledgements
/* socket.emit('createMessage', {
    from: 'Frank',
    text: 'Hi'
}, function(data) {
    console.log('Got it', data);
}); */

socket.on('newLocationMessage', function(message) {
    /* var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from} (${formattedTime})`);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li); */

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = document.querySelector('#location-message-template').innerHTML;
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });
    document.querySelector('#messages').insertAdjacentHTML('beforeend', html);

    scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        // from: 'User',
        text: messageTextbox.val()
    }, function() { // acknowledgement
        messageTextbox.val('');
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    
    locationButton.attr('disabled', 'disabled').text('Sending location...');;

    navigator.geolocation.getCurrentPosition(function(position) {
        // console.log(position);

        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        locationButton.removeAttr('disabled').text('Send location');;
        alert('Unable to fetch location.');
    });
});