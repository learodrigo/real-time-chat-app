const formatTime = (time) => `${new Date(time).getHours()}:${new Date(time).getMinutes()} hs`

const generateMessage = ({ text, username }) => {
    return {
        createdAt: formatTime(new Date().getTime()),
        text,
        username
    }
}

const generateLocationMessage = ({ url, username }) => {
    return {
        createdAt: formatTime(new Date().getTime()),
        url,
        username
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}
