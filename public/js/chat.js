document.addEventListener('DOMContentLoaded', () => {
    const socket = io()

    socket.on('message', (message) => {
        console.log(message)
    })

    const $messageForm = document.querySelector('#messageForm')
    const $input = $messageForm.querySelector('[name="message"]')
    $input.value = ''

    $messageForm.addEventListener('submit', (evt) => {
        evt.preventDefault()

        const regex = /<\/?[a-z][a-z0-9]*[^<>]*>|<!--.*?-->/img
        const message = $input.value.replace(regex, "")

        if (!message) {
            $input.value = ''
            $input.focus()
            return
        }

        socket.emit('sendMessage', message)

        $input.value = ''
    })

    const $locationButton = document.querySelector('#locationButton')
    $locationButton.addEventListener('click', () => {
        if (!navigator.geolocation) {
            return alert('Looks like you are using an old browser which does not support this feature. Sorry :(')
        }

        navigator.geolocation.getCurrentPosition((pos) => {
            socket.emit('sendLocation', {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            })
        })
    })
})
