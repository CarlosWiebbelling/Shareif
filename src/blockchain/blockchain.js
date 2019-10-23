const crypto = require('crypto');
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

class Block {
  constructor(timestamp, toAddress, fromAddress, message, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.toAddress = toAddress;
    this.fromAddress = fromAddress;
    this.message = message;
    this.hash = this.calculateHash();
  }
  
  calculateHash() {
    return crypto.createHash('sha256').update(this.previousHash + this.timestamp + this.message).digest('hex');
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!');
    }
    
    const sig = signingKey.sign(this.hash, 'base64');

    this.signature = sig.toDER('hex');
  }

  isValid() {
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }

  getMessage() {
    return this.message
  }
}

class Blockchain {
  constructor() {
    this.broadcast = ec.genKeyPair()
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    let genesis = new Block(
      Date.parse('2017-01-01'), 
      "127.0.0.1",
      '192.168.0.1',
      "Hello! Welcome to Shareif.", 
      this.broadcast.getPrivate('hex'));
    return genesis;
  }

  /**
   * Returns the latest block on our chain. Useful when you want to create a
   * new Block and you need the hash of the previous Block.
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addMessage(block) {
    if(!block.isValid())
      throw new Error('Block invalid');

    if (!block.fromAddress || !block.toAddress)
      throw new Error('Message must include from and to address');
    
    if (block.message <= 0) {
      throw new Error('Message length should be higher than 0');
    }
    
    this.chain.push(block);
  }

  getAllMessages(address) {
    const messages = [];

    for (const block of this.chain) {
      if (block.toAddress === address) {        // block.fromAddress === address
        messages.push(block);
      }
    }

    return messages;
  }

  /**
   * Loops over all the blocks in the chain and verify if they are properly
   * linked together and nobody has tampered with the hashes. By checking
   * the blocks it also verifies the (signed) transactions inside of them.
   */
  isChainValid() {
    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      if (!currentBlock.isValid()) {
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;