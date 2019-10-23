const Node = require('./node');
const { getLocalAddress } = require('./localAddress');

if (!process.env.PORT)
  throw Error('PORT expected.');

const port = process.env.PORT;
const host = getLocalAddress() || '0.0.0.0';

const server = new Node(port, host);
