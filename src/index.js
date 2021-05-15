require('dotenv').config()
const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')

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
    socket.emit('message', 'Welcome!')

    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('sendMessage', (msg, callback) => {
        const regex = /<|>/g
        const message = msg.replace(regex, "")

        if (!message) return callback('Hum, naughty naughty. Injections are bad.')

        io.emit('message', message.trim())
        callback()
    })

    socket.on('sendLocation', (coords, callbak) => {
        if (!coords || !coords.lat || !coords.lon) {
            return callbak('Something went wrong with your coordinates')
        }

        io.emit('message', `https://www.google.com/maps?q=${coords.lat},${coords.lon}`)
        callbak()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A new user has left the room')
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
