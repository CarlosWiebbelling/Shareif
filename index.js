const fs = require('fs');
const server = require('uWebSockets.js');

const { peer } = require('./src/node/index');
const { Blockchain, Block, shareif } = require('./src/blockchain/index');

const page = fs.readFileSync('./src/public/index.html', 'utf-8');

peer.onMessage = (socket, message) => {
  console.log(`Received: ${message}`)
  peer.broadcast(message)
}

const handleCreatePair = payload => {
  console.log(`Seed:${payload.seed}`);
  console.log(peer.getConnectionsAddress())

  // peer.broadcast(payload.seed)
};

const handleSendMessage = payload => {
  console.log(`publicKey:${payload.publicKey}`);
  console.log(`msg:${payload.msg}`);
};

const handleSignIn = payload => {
  console.log(`publicKey:${payload.publicKey}`);
  console.log(`privateKey:${payload.privateKey}`);
};

server
  .App()
  .ws('/*', {
    message: (ws, message, isBinary) => {
      const msg = JSON.parse(Buffer.from(message).toString());
      console.log(msg)
      switch (msg.type) {
        case 'PING_CREATE_PAIR':
          handleCreatePair(msg.payload);
          break;
        case 'SEND_MESSAGE':
          handleSendMessage(msg.payload);
          break;
        case 'SIGN_IN':
          handleSignIn(msg.payload);
          break;
        default:
          break;
      }

      // console.log(msg);
      // peer.broadcast(msg);

      ws.send(JSON.stringify({ ss: 'dsauyggdysaygdsaydsay' }), isBinary);
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

console.log(shareif);
