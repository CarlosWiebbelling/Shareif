const fs = require('fs');
const crypto = require("crypto");
const server = require('uWebSockets.js');

const { node } = require('./src/node/index');
const { Blockchain, Block } = require('./src/blockchain/index');

const shareif = new Blockchain();

shareif.addMessage(new Block(
  Date.parse("2017-01-01"),
  shareif.mainChannel.publicKey,
  'sadsadsadsad',
  "Batata frita",
  shareif.getLatestBlock().hash
))

console.log(shareif);

const page = fs.readFileSync('./src/public/index.html', 'utf-8');

node.onMessage = (socket, message) => {
  console.log(`Received: ${message}`)
  node.broadcast(message)
}

const handleCreatePair = payload => {
  console.log(`Seed:${payload.seed}`);
  console.log(node.getConnectionsAddress())

  // node.broadcast(payload.seed)
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
      // node.broadcast(msg);

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
