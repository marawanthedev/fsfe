const express = require('express')
const server = require('http').createServer()
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {

  res.sendFile('index.html', { root: __dirname })

})

server.on('request', app)

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})


/** Begin web socket */

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  const numClients = wss.clients.size;
  console.log(`Clients connected:${numClients}`)
  wss.broadcast(`Current visitors ${numClients}`)

  if (ws.readyState === ws.OPEN) {
    ws.send('Welcome to my server')
  }

  ws.on('close', function close() {
    console.log(`Client ${ws.id} disconnected`)
    wss.broadcast(`Client ${ws.id} disconnected`)
  })
})

wss.broadcast= function broadcast(data){
  wss.clients.forEach(function each(client){
    if (client.readyState === client.OPEN) {
      client.send(data)
    }
  })
}
