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
})
