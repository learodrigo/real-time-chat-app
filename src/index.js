require('dotenv').config()

const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')

const { generateMessage, generateLocationMessage } = require('./utils/messages')

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
    socket.on('join', ({ username, room }) => {
        socket.join(room)

        socket.emit('message', generateMessage(`Welcome, ${username}!`))

        socket.broadcast.to(room).emit('message', generateMessage(`${username} has just joined.`))

    })

    socket.on('sendMessage', (msg, callback) => {
        const regex = /\<|\>/g
        const message = msg.replace(regex, "")

        if (!message) return callback('Hum, naughty naughty. Injections are bad.')

        io.emit('message', generateMessage(message.trim()))

        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        if (!coords || !coords.lat || !coords.lon) {
            return callback('Something went wrong with your coordinates')
        }

        io.emit('locationMessage', generateLocationMessage(`https://www.google.com/maps?q=${coords.lat},${coords.lon}`))

        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A new user has left the room'))
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
