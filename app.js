const express = require('express')
const server = require('http').createServer()
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {

  res.sendFile('index.html',{root:__dirname})

})

server.on('request', app)

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})