const socket = io()

//localStorage.setItem('init_token', '8743ytf9825g4976f')
//localStorage.setItem('user_id', 'i4u5hgt4387o')
//localStorage.removeItem('user_id')
//localStorage.removeItem('init_token')

class main_controller {
    constructor() {
        this.chatList = document.querySelector('.chats')
        this.chats = null
        this.activeChat = null;
        this.activeChatElemInit = null
    }

    init() {
        if (!localStorage.getItem('init_token')) {
            location.href = '/registration'
        } else {
            socket.on('connect', () => {
                console.log(`Connect`);
            })

            socket.on('new_message', (msg) => {
                const message = document.createElement('p')
                message.textContent = msg
                document.querySelector('.chat-board').appendChild(message)
            })

            fetch('/chats', {
                method: 'GET',
                headers: { 'Auth-Key': localStorage.getItem('init_token') },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        return data.data
                    }
                })
                .then(chatsObj => {
                    this.chats = chatsObj
                    console.log(chats);

                    chatsObj.forEach((chat, i) => {
                        const chatLine = document.createElement('span')
                        chatLine.textContent = chat.user_entity.username
                        chatLine.setAttribute('draggable', 'true')
                        chatLine.classList.add('chat_line')
                        this.chatList.appendChild(chatLine)

                        chatLine.addEventListener('dragstart', (e) => {
                            this.activeChatElemInit = e.target
                        })
                    })
                })
        }
    }

    async modal_history(chat, parent) {
        parent.innerHTML = ''

        parent.innerHTML = `
                    <div class='chat-board'></div>
                    <div class='send_messages_panel'>
                        <input type='text' id='inp'>
                        <button class='send'>Отправить</button>
                    </div>
                `

        const resHistory = await fetch(`/messages?chat_id=${this.activeChat.chat_id}`, {
            method: 'GET'
        })
        const history = await resHistory.json()

        history.data.messages.forEach((message) => {
            const message_line = document.createElement('p')
            message_line.textContent = message.content
            if (message.to === localStorage.getItem('user_id')) {
                message_line.classList.add('my-messages')
            }
            document.querySelector('.chat-board').appendChild(message)
        })

        const sendBtn = parent.querySelector('.send');
        const input = parent.querySelector('#inp');

        sendBtn.addEventListener('click', async () => {
            const newMessageText = input.value
            const newMessage = document.createElement('p')
            newMessage.textContent = newMessageText
            document.querySelector('.chat-board').appendChild(newMessage)

            socket.emit('new_message', newMessageText, chat)
            //отправка нового сообщения в история чата
            await fetch('', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: newMessageText
                })
            })
        })
    }

    drag_drop_init() {
        document.querySelector('.mainDialog').addEventListener('dragover', (e) => {
            e.preventDefault()
        })

        document.querySelector('.mainDialog').addEventListener('drop', (e) => {
            socket.emit('exit_room', activeChat)
            if (e.target.classList.contains('mainDialog')) {
                if (activeChatElemInit.classList.contains('chat_line')) {
                    chats.forEach((chat, i) => {
                        if (chat.user_entity.username === activeChatElemInit.textContent) {
                            activeChat = chat
                            console.log(activeChat);
                        }
                    })
                }

                this.modal_history(activeChat, e.target)
                socket.emit('enjoy_chat', activeChat)
            }
        })
    }

    debounce(func, delay) {
        let timer

        return function () {
            clearTimeout(timer)
            timer = setTimeout(() => {func.apply(this, arguments)}, delay)
        }
    }

    search_users() {
        const inp = document.querySelector('#user-search-inp')

        const debounce_handler = this.debounce(async (e) => {
            const search_nickname = e.target.value
            console.log(search_nickname);

            const res = await fetch(`/path/search?q=${search_nickname}`, {
                method: 'GET'
            })

            const data = await res.json()

            document.querySelector('.autocomplete-dropdown').innerHTML = ''
            document.querySelector('.autocomplete-dropdown').classList.remove('active')

            if (data.success) {
                data.nicks.forEach((nick, i) => {
                    const line = document.createElement('div')
                    line.textContent = nick
                    document.querySelector('.autocomplete-dropdown').appendChild(line)

                    document.querySelector('.autocomplete-dropdown').classList.add('active')
                })
            }
        }, 300)

        inp.addEventListener('input', debounce_handler)
    }

    start() {
        this.init();
        this.drag_drop_init()
        this.search_users()
    }
}

const controller = new main_controller()
controller.start()