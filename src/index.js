require('dotenv').config()

const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/messages')

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users')

const PORT = process.env.PORT

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicPath = path.join(__dirname, '../public/')
app.use(express.static(publicPath))

app.get('', (req, res) => {
    res.render('index')
})

io.on('connection', (socket) => {
    console.log('SocketIO connected')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, room, username })

        if (error) return callback(error)

        socket.join(user.room)

        socket.emit('message', generateMessage({
            text: `Welcome, ${user.username}!`,
            username: 'Admin'
        }))

        socket.broadcast.to(user.room).emit('message', generateMessage({
            text: `${user.username} has just joined.`,
            username: 'Admin'
        }))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const regex = /\<|\>/g
        const message = msg.replace(regex, '').trim()
        const user = getUser(socket.id)

        if (!message) return callback('Hum, naughty naughty. Injections are bad.')

        io.to(user.room).emit('message', generateMessage({
            text: message,
            username: user.username
        }))

        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        if (!coords || !coords.lat || !coords.lon) {
            return callback('Something went wrong with your coordinates')
        }

        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage({
            url: `https://www.google.com/maps?q=${coords.lat},${coords.lon}`,
            username: user.username
        }))

        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage({
                text: `${user.username} has left the room`,
                username: 'Admin'
            }))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
