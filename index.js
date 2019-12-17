const fs = require('fs');
const server = require('uWebSockets.js');

const { node } = require('./src/node/index');
const { Blockchain, Block, generateKeyPair } = require('./src/blockchain/index');
const shareif = new Blockchain();
const page = fs.readFileSync('./src/public/index.html', 'utf-8');

let actualWS = null;
const subscribedChannels = {};

// ---------------------------------------------------------------------------------

const handleCreatePair = (ws) => {
  const keys = generateKeyPair();
  ws.send(JSON.stringify({ type: 'PONG_CREATE_PAIR', payload: keys }));
  console.log(shareif.chain);
  // console.log(node.getConnectionsAddress())
};

const handleSendMessage = (ws, payload) => {
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

const handleSignIn = (ws, payload) => {
  subscribedChannels[payload.publicKey] = true;
  const msgs = shareif.getChatMessages(payload.publicKey);
  
  ws.send(JSON.stringify({
    type: 'PONG_CREATE_PAIR', 
    payload: msgs
  }));
  
  // console.log(`publicKey:${payload.publicKey}`);
  // console.log(`privateKey:${payload.privateKey}`);
};

// ---------------------------------------------------------------------------------

const handleBlockPropagation = (socket, block) => {
  console.log(block);
  // eu ja tenho esse bloc
  // 
  if (actualWS) actualWS.send('dsadsadsada')
};

// ---------------------------------------------------------------------------------

node.onMessage = (socket, message) => {
  const data = JSON.parse(message.toString());
  console.log(data);

  switch (data.type) {
    case 'BLOCK_PROPAGATION':
      handleBlockPropagation(socket, data.payload);
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
      actualWS = ws;
    },
    message: (ws, message, isBinary) => {
      const msg = JSON.parse(Buffer.from(message).toString());
      switch (msg.type) {
        case 'PING_CREATE_PAIR':
          handleCreatePair(ws);
          break;
        case 'SEND_MESSAGE':
          handleSendMessage(ws, msg.payload);
          break;
        case 'SIGN_IN':
          handleSignIn(ws, msg.payload);
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
