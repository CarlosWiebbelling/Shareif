const crypto = require('crypto')
const EC = require('elliptic').ec

const ec = new EC('secp256k1')
const length = 256

const { Blockchain, Block } = require('./blockchain')
const shareif = new Blockchain()

// Users
const user2 = crypto.createDiffieHellman(length)
user2.generateKeys('hex')

// Chat 1
const newBlock = new Block(
	Date.parse('2017-01-01'),
	shareif.broadcast.publicKey,
	user2.getPublicKey('hex'),
	'Batata frita',
	shareif.getLatestBlock().hash
)

newBlock.signTransaction(shareif.broadcast.privateKey)

shareif.addMessage(newBlock)

console.log(shareif)
