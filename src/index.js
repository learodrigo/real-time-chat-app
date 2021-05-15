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

io.on('connection', () => {
    console.log('Socket.IO connected')
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
