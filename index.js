const fs = require('fs');
const server = require('uWebSockets.js');

const { peer } = require('./src/node/index');
const { Blockchain, Block, shareif } = require('./src/blockchain/index');

const page = fs.readFileSync('./src/public/index.html', 'utf-8');

const handleCreatePair = payload => {
  console.log(`Seed:${payload.seed}`);
};

const handleSendMessage = payload => {
  console.log(`Seed:${payload.publicKey}`);
  console.log(`Seed:${payload.msg}`);
};

const handleSignIn = payload => {
  console.log(`Seed:${payload.publicKey}`);
  console.log(`Seed:${payload.privateKey}`);
};


peer.onMessage = (socket, message) => {
  console.log(`Received: ${message}`)
  peer.broadcast(message)
}


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

/*

Fronted

PONG_CREATE_PAIR {
  publicKey
  privateKey
}

PONG_SEND_MESSAGE {

}

RECEIVE_MESSAGES {
  publicKey,
  msg
}

*/