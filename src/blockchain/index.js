const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const { Blockchain, Block } = require('./blockchain')

const shareif = new Blockchain();

// Users
const user1 = ec.genKeyPair()

console.log(user1)

// Chat 1
const newBlock = new Block(
  Date.parse('2017-01-01'), 
  shareif.broadcast.getPublic('hex'),
  user1.getPublic('hex'),
  "This is the second message of the Shareif chat",
  shareif.getLatestBlock().hash
);

newBlock.signTransaction(shareif.broadcast);
shareif.addMessage(newBlock)

const newBlock2 = new Block(
  Date.parse('2017-01-01'), 
  shareif.broadcast.getPublic('hex'),
  user1.getPublic('hex'),
  "This is the third message of the Shareif chat",
  shareif.getLatestBlock().hash
);

newBlock2.signTransaction(shareif.broadcast);
shareif.addMessage(newBlock2)


console.log(shareif)