const fs = require('fs');
const server = require('uWebSockets.js');
const { peer } = require('./src/node/index');
const page = fs.readFileSync('./src/public/index.html', 'utf-8');

server
  .App()
  .ws('/*', {
    message: (ws, message, isBinary) => {
      const msg = Buffer.from(message).toString();
      console.log(msg);
      peer.broadcast(msg);

      // let ok = ws.send(message, isBinary);
    }
  })
  .any('/*', (res, req) => {
    res.end(page);
  })
  .listen(8080, listenSocket => {
    if (listenSocket) {
      console.log(`[8080] Listening for connections...`);
    }
  });