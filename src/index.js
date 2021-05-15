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

    socket.on('sendMessage', (msg) => {
        const regex = /<\/?[a-z][a-z0-9]*[^<>]*>|<!--.*?-->/img
        const message = msg.replace(regex, "")

        if (message) {
            io.emit('message', message)
        }
    })

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://www.google.com/maps?q=${coords.lat},${coords.lon}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A new user has left the room')
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
