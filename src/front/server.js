const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const server = http.createServer(app)

const io = new Server(server)

app.use(express.static(path.join(__dirname)))
app.use(express.static(path.join(__dirname, 'modules')))

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/chats', (req, res) => {
    const data = {}

    res.send(JSON.stringify(data))
})

app.get('/messages', (_, res) => {
    res.send(JSON.stringify({
        messages: ['hello', 'hello', 'how you?']
    }))
})

app.get('/registration', (_, res) => {
    res.sendFile(path.join(__dirname, 'modules', 'registration.html'))
})

io.on('connection', (socket) => {
    console.log(`Socket  ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Socket отключился ${socket.id}`);

    })

    socket.on('enjoy_chat', (active_chat) => {
        socket.join(active_chat.chat_id)
        console.log('Socket add room');
    })

    socket.on('exit_room', (active_chat) => {
        socket.leave(active_chat.chat_id)
    })

    socket.on('new_message', (msg, active_chat) => {
        socket.to(active_chat.chat_id).emit('new_message', msg)
    })
})

server.listen(9000, () => {
    console.log('Сервер запущен');
})

//min test api
/*app.use(express.json());

let users = []

app.post('/api/users/register', (req, res) => {
    try {
        const user = req.body;

        users.push(user)
        console.log(users);
        res.send(true)    
    } catch (error) {
        res.send(false)
    }
    
})

app.post('http://localhost:9000/api/users/login', (req, res) => {

})*/