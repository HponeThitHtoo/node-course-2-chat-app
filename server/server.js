const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

/* console.log(__dirname + '/../public');
console.log(publicPath); */

const port = process.env.PORT || 3000; // for heroku
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

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

    /* socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // emit event to every clients but not newUser
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined')); */

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        // join the user to the chat room (in real program)
        socket.join(params.room);
        // socket.leave('The Office Fans);

        // remove user from currently connected room (in array)
        users.removeUser(socket.id);
        // add user to particular room (in array)
        users.addUser(socket.id, params.name, params.room);

        // emit event to every one in a desire chat room
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // io.emit -> io.to('The Office Fans').emit
        // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
        // socket.emit

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        // emit event to every clients but not newUser
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

        callback();
    });

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

    // Event Acknowledgements callback
    socket.on('createMessage', (message, callback) => {
        // console.log('Create Message', message);
        // get the message sending user
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            // emit event to every clients in particular chat room
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        // callback('This is from the server.');
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        // get the message sending user
        var user = users.getUser(socket.id);

        if (user) {
            // emit event to every clients in particular chat room
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

    });

    socket.on('disconnect', () => {
        // console.log('User was disconnected');

        // remove disconnected user from array
        var user = users.removeUser(socket.id);

        if (user) {
            // emit event to all user in the particular chat room
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            // emit event to all user in the particular chat room
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});