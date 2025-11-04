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

app.get('/chats', (req, res) => {
    const data = {
        chats: [
            {
                partherId: 'test1',
                room: '8743ytf9825g4976f/odfb4356tfhygdfgt4653',
                history: []
            },
            {
                partherId: 'test2',
                room: '8743ytf9825g4976f/324h0f87245f8',
                history: []
            }
        ]
    }

    res.send(JSON.stringify(data))
})

app.get('/messages', (_, res) => {
    res.send(JSON.stringify({
        messages: ['hello', 'hello', 'how you?']
    }))
})

app.get('/registration', (_, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'))
})

io.on('connection', (socket) => {
    console.log(`Socket  ${socket.id}`);
    let describeingRoomObj;
    
    socket.on('disconnect', () => {
        console.log(`Socket отключился ${socket.id}`);
        
    })

    socket.on('enjoy_chat', (describeingRoom ) =>{
        socket.join(describeingRoom.room)
        console.log('Socket add room');
        
        describeingRoomObj = describeingRoom
    })

    socket.on('new_message', (msg) => {
        socket.to(describeingRoomObj.room).emit('new_message', msg)
    })
})

server.listen(9000, () => {
    console.log('Сервер запущен');
})