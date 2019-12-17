const net = require('net');

class Node {
  constructor(port, host) {
    this.port = port;
    this.host = host;
    this.connections = [];

    const server = net.createServer(socket => {
      this.onSocketConnected(socket);
    });


    server.listen(port, '0.0.0.0', () => {
      console.log(`[${port}] Listening for connections...`);
    });

    this.localDiscovery(server);
  }

  localDiscovery(server) {
    for (let i = 1; i < 63; i++) {
      this.connectTo(`10.132.84.${i}:10492`);
    }
  }

  getConnectionsAddress() {
    return this.connections.map(socket => socket.remoteAddress);
  }

  connectTo(address) {
    if (address.split(':').length !== 2)
      throw Error('Syntax error: host:port');

    const [host, port] = address.split(':');

    if (this.host === host)
      return;

    const socket = net.createConnection({
      port,
      host
    }, () => {
      this.onSocketConnected(socket);
    });

    socket.on('error', err => this.onError(socket, err));
  }

  onSocketConnected(socket) {
    console.log('Socket connected.');
    this.connections.push(socket);

    socket.on('data', message => this.onMessage(socket, message));
    socket.on('close', hadError => this.onClose(socket, hadError));

    this.onConnection(socket);
  }

  onMessage(socket, message) {
    // console.log('Received: ', message.toString());
  }

  onConnection(socket) {
    // console.log(this.connections.length);  
  }

  onClose(socket, hadError) {
    console.log('Socket closed.');
    const index = this.connections.indexOf(socket);
    if (index !== -1)
      this.connections.splice(index, 1);
  }

  onError(socket, err) {
    switch (err.code) {
      case 'EHOSTUNREACH':
      // return console.log(`[${err.code}] Cannot connect to: ${err.address}`);
      default:
        return err;
    }
  }

  broadcast(message) {
    this.connections.forEach(socket => socket.write(message));
  }
}

module.exports = Node;