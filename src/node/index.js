const Node = require('./node');
const { getLocalAddress } = require('./local-address');

if (!process.env.PORT)
  throw Error('PORT expected.');

const port = process.env.PORT;
const host = getLocalAddress() || '0.0.0.0';

const node = new Node(port, host);

module.exports = { node };
