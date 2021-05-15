document.addEventListener('DOMContentLoaded', () => {
    const socket = io()

    const $messageForm = document.querySelector('#messageForm')
    const $inputMessage = $messageForm.querySelector('#message')
    const $submitButton = $messageForm.querySelector('#submitButton')
    const $locationButton = document.querySelector('#locationButton')

    $inputMessage.value = ''

    socket.on('message', (message) => console.log(message))

    $messageForm.addEventListener('submit', (evt) => {
        evt.preventDefault()

        $submitButton.setAttribute('disabled', 'disabled')

        const message = evt.target.elements.message.value.trim()

        socket.emit('sendMessage', message, (error) => {
            $submitButton.removeAttribute('disabled')
            $inputMessage.value = ''
            $inputMessage.focus()

            if (error) return console.log(error)

            console.log('Message delivered')
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

                console.log('Position delivered')
            })
        })
    })
})
