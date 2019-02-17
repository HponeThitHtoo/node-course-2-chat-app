const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

/* console.log(__dirname + '/../public');
console.log(publicPath); */

const port = process.env.PORT || 3000; // for heroku
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    /* socket.emit('newEmail', {
        from: 'mike@example.com',
        text: 'Hey. What is going on.',
        createdAt: 123
    });

    socket.on('createEmail', (newEmail) => {
        console.log('createEmail', newEmail);
    }); */

    /* socket.emit('newMessage', { // emit event to a single client
        from: 'John',
        text: 'See you then',
        createdAt: 123123
    }); */

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // emit event to every clients but not newUser
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    /* socket.on('createMessage', (message) => {
        console.log('Create Message', message);
        // emit event to every clients
        io.emit('newMessage', generateMessage(message.from, message.text));
        // emit event to every clients but not myself
        // socket.broadcast.emit('newMessage', { 
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    }); */

    // Event Acknowledgements
    socket.on('createMessage', (message, callback) => {
        console.log('Create Message', message);
        // emit event to every clients
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server.');
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});