const socket = io()

document.addEventListener('DOMContentLoaded', () => {
    // DOM
    const $messages = document.querySelector('#messages')
    const $messageForm = document.querySelector('#messageForm')
    const $submitButton = $messageForm.querySelector('#submitButton')
    const $inputMessage = $messageForm.querySelector('#message')
    const $locationButton = document.querySelector('#locationButton')

    // Templates
    const messageTemplate = document.querySelector('#messageTemplate').innerHTML
    const locationTemplate = document.querySelector('#locationTemplate').innerHTML

    // Options
    $inputMessage.value = ''
    const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

    // Socket
    socket.emit('join', { username, room }, (error) => {
        if (error) {
            alert(error)
            location.href = '/'
        }
    })

    socket.on('message', (message) => {
        const html = Mustache.render(messageTemplate, {
            createdAt: message.createdAt,
            message: message.text,
            username: message.username
        })

        $messages.insertAdjacentHTML('beforeend', html)
    })

    socket.on('locationMessage', (message) => {
        const html = Mustache.render(locationTemplate, {
            createdAt: message.createdAt,
            url: message.url,
            username: message.username
        })

        $messages.insertAdjacentHTML('beforeend', html)
    })

    // Events
    $messageForm.addEventListener('submit', (evt) => {
        evt.preventDefault()

        $submitButton.setAttribute('disabled', 'disabled')

        const message = evt.target.elements.message.value.trim()

        socket.emit('sendMessage', message, (error) => {
            $submitButton.removeAttribute('disabled')
            $inputMessage.value = ''
            $inputMessage.focus()

            if (error) return console.log(error)
        })
    })

    $locationButton.addEventListener('click', () => {
        $locationButton.setAttribute('disabled', 'disabled')

        if (!navigator.geolocation) {
            return alert('Your browser does not support geolocation')
        }

        navigator.geolocation.getCurrentPosition((pos) => {
            socket.emit('sendLocation', {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            }, (error) => {
                $locationButton.removeAttribute('disabled')

                if (error) return console.error(error)
            })
        })
    })
})
