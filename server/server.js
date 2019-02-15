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

    socket.emit('newMessage', {
        from: 'John',
        text: 'See you then',
        createdAt: 123123
    });

    socket.on('createMessage', (message) => {
        console.log('Create Message', message);
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});