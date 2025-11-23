class controller_reg {
            constructor() {
                this.mainDiv = document.getElementById('main')
            }

            modal(name, sendFetch, only_for_reg) {
                const modal = document.createElement('div')
                modal.innerHTML = `
                    <span class='close'>Закрыть</span> 
                    <h3>${name}</h3>
                    <input class='usernameInp' placeholder='Введите nickname' type='text' maxlength='10' >
                    <input class='passInp' placeholder='Введите пароль' type='password'>
                    ${only_for_reg ? only_for_reg : ''}
                    <button class='send'>Отправить</button>
                `
                modal.classList.add('modal')
                this.mainDiv.appendChild(modal)
    
                const closeBtn = modal.querySelector('.close');
                const sendBtn = modal.querySelector('.send');
                const usernameInput = modal.querySelector('.usernameInp')
                const nameInput = only_for_reg && modal.querySelector('.nameInp') ;
                const passInput = modal.querySelector('.passInp');
    
                closeBtn.addEventListener('click', () => {
                    modal.remove()
                })
    
                sendBtn.addEventListener('click', async() => {
                    if (nameInput.value !== '' && passInput.value !== '') {
                        const data = {
                            real_name: only_for_reg ? usernameInput.value : null,
                            username: nameInput.value,
                            password: passInput.value
                        }
                        console.log(data);
                        modal.remove()
                        await sendFetch(data)
                    } else {
                        alert('Все поля обязательны для заполнения!')
                    }
                })
            }

            registration() {
                document.getElementById('regBtn').addEventListener('click', () => {
                    this.modal('Регистрация', async(formData) => {
                        const res = await fetch('http://localhost:3000/api/users/register', {
                            method: 'POST',
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify(formData)
                        })

                        const data = await res.json()
                        if (res) {
                            alert('Регистрация прошла успешно!');
                        } else {
                            alert('Ошибка регистрации')
                        }
                    }, `<input class='nameInp' placeholder='Введите ФИО' type='text' maxlength='55' ></input>`)
                })
            }

            login() {
                document.getElementById('loginBtn').addEventListener('click', () => {
                    this.modal('Вход', async (formData) => {
                        const res = await fetch('http://localhost:3000/api/users/login', {
                            method: 'POST',
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify(formData)
                        }) 
                        
                        const data = await res.json()
                        if (data.success && data.token) {
                            localStorage.setItem('init_token', data.token)
                            location.href = '/'
                        } else {
                            alert('Такого пользователя не существует')
                        }
                    })
                })
            }

            start() {
                this.login();
                this.registration();
            }
        } 

        const controller_reg_login = new controller_reg()
        controller_reg_login.start()