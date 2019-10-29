const crypto = require('crypto')
const EC = require('elliptic').ec

const ec = new EC('secp256k1')
const length = 128

const { Blockchain, Block } = require('./blockchain')
const shareif = new Blockchain();

// Users
const user2 = crypto.createDiffieHellman(length)
user2.generateKeys('hex')

console.log(`Public key: ${ user2.getPublicKey() }\n`)
console.log(`Private key: ${ user2.getPrivateKey() }`)

// // Chat 1
// const newBlock = new Block(
//   Date.parse('2017-01-01'), 
//   shareif.broadcast.getPublic,
//   user2.getPublic,
//   "This is the second message of the Shareif chat",
//   shareif.getLatestBlock().hash
// );

// newBlock.signTransaction(shareif.broadcast);
// shareif.addMessage(newBlock)

// const newBlock2 = new Block(
//   Date.parse('2017-01-01'), 
//   shareif.broadcast.getPublic,
//   user2.getPublic,
//   "This is the third message of the Shareif chat",
//   shareif.getLatestBlock().hash
// );

// newBlock2.signTransaction(shareif.broadcast);
// shareif.addMessage(newBlock2)

// console.log(shareif)