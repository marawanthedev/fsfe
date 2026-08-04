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


let shuttingDown = false

function shutdown() {
  if (shuttingDown) return
  shuttingDown = true
  console.log('SIGINT signal received, shutting down gracefully')

  // 1. forcibly close every web socket client. terminate() destroys the
  // underlying socket immediately; close() only starts a handshake that a
  // refreshing browser may never complete, which would hang server.close().
  wss.clients.forEach((client) => {
    console.log('Closing web socket client')
    client.terminate()
  })

  // 2. stop the web socket server from accepting new connections
  wss.close(() => {
    console.log('WebSocket server closed')
  })

  // 3. destroy all remaining HTTP connections (active + idle) so server.close drains
  server.closeAllConnections()

  // 4. stop the HTTP server once all connections have drained
  server.close(() => {
    console.log('HTTP server closed')

    // 5. finally close the database
    shutdownDB()
  })
}

process.on('SIGINT', shutdown)

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

  db.run(`INSERT INTO visitors (count, time) VALUES (${numClients}, datetime('now'))`)

  ws.on('close', function close() {
    console.log(`Client ${ws.id} disconnected`)
    wss.broadcast(`Client ${ws.id} disconnected`)
  })
})

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(data)
    }
  })
}

/** End web socket */

/** Begin Database */

const sqllite = require('sqlite3');
const db = new sqllite.Database(':memory:');

db.serialize(() => {

  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    );

    `)
})


function getCounts(done) {
  db.all(`SELECT * FROM visitors`, (err, rows) => {
    if (err) {
      console.error(err)
    } else {
      rows.forEach((row) => console.log(row))
    }

    if (done) done()
  })
}

function shutdownDB() {
  getCounts(() => {
    console.log('Shutting down database')
    db.close((err) => {
      if (err) {
        console.error(err)
        return
      }

      console.log('Database closed')
    })
  })
}


/** End Database */
