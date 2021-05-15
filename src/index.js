require('dotenv').config()
const path = require('path')
const express = require('express')

const PORT = process.env.PORT

const app = express()

const publicPath = path.join(__dirname, '../public/')
app.use(express.static(publicPath))

app.get('', (req, res) => {
    res.render('index')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
