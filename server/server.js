const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chap app',
        createAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', { // emit event to every clients but not newUser
        from: 'Admin',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log('Create Message', message);
        io.emit('newMessage', { // emit event to every clients
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        /* socket.broadcast.emit('newMessage', { // emit event to every clients but not myself
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        }); */
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});