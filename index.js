const fs = require('fs');
const server = require('uWebSockets.js');

const { node } = require('./src/node/index');
const { Blockchain, Block, generateKeyPair } = require('./src/blockchain/index');

const shareif = new Blockchain();
// console.log(shareif);

const page = fs.readFileSync('./src/public/index.html', 'utf-8');

node.onMessage = (socket, message) => {
  console.log(`Received: ${message}`)
  node.broadcast(message);
}

const handleCreatePair = (ws, isBinary, payload) => {
  const keys = generateKeyPair();
  ws.send(JSON.stringify({ type: 'PONG_CREATE_PAIR', payload: keys }), isBinary);
  console.log(shareif.chain);
  // console.log(node.getConnectionsAddress())
};

const handleSendMessage = (payload) => {
  const block = new Block(
    Date.now(),
    payload.publicKey,
    payload.userId,
    payload.msg,
    shareif.getLatestBlock().hash
  );

  block.sign(payload.publicKey);
  shareif.addMessage(block);

  // console.log(shareif.getLatestBlock());
};

const handleSignIn = (payload) => {
  const msg = shareif.getLatestBlock().getMessage(payload.privateKey);
  console.log(msg);
  // console.log(`publicKey:${payload.publicKey}`);
  // console.log(`privateKey:${payload.privateKey}`);
};

server
  .App()
  .ws('/*', {
    message: (ws, message, isBinary) => {
      const msg = JSON.parse(Buffer.from(message).toString());
      switch (msg.type) {
        case 'PING_CREATE_PAIR':
          handleCreatePair(ws, isBinary, msg.payload);
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
