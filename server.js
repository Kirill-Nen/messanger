const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const server = http.createServer(app)

const io = new Server(server)

app.use(express.static(path.join(__dirname)))

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/registration', (_, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'))
})

io.on('connection', (socket) => {
    console.log(`Socket  ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`Socket отключился ${socket.id}`);
        
    })
})

server.listen(9000, () => {
    console.log('Сервер запущен');
})