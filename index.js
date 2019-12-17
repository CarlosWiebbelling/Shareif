const fs = require('fs');
const server = require('uWebSockets.js');

const { node } = require('./src/node/index');
const { Blockchain, Block, generateKeyPair } = require('./src/blockchain/index');
const shareif = new Blockchain();
const page = fs.readFileSync('./src/public/index.html', 'utf-8');

const handleCreatePair = (ws) => {
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
  node.broadcast(JSON.stringify({
    type: 'BLOCK_PROPAGATION',
    payload: block
  }));
};

const handleSignIn = (payload) => {
  const msg = shareif.getLatestBlock().getMessage(payload.privateKey);
  console.log(msg);
  // console.log(`publicKey:${payload.publicKey}`);
  // console.log(`privateKey:${payload.privateKey}`);
};

node.onMessage = (socket, message) => {
  const data = JSON.parse(message.toString());
  console.log(data);

  switch (data.type) {
    case 'BLOCK_PROPAGATION':
      console.log(data.payload);
      break;
    default:
      break;
  }

  // node.broadcast(message);
}

server
  .App()
  .ws('/*', {
    open: (ws, req) => {
      console.log('Front-end connected');

    },
    message: (ws, message, isBinary) => {
      const msg = JSON.parse(Buffer.from(message).toString());
      switch (msg.type) {
        case 'PING_CREATE_PAIR':
          handleCreatePair(ws);
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
