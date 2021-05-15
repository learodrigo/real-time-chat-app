const formatTime = (time) => `${new Date(time).getHours()}:${new Date(time).getMinutes()} hs`

const generateMessage = (message) => {
    return {
        message,
        createdAt: formatTime(new Date().getTime())
    }
}

const generateLocationMessage = (url) => {
    return {
        url,
        createdAt: formatTime(new Date().getTime())
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}
