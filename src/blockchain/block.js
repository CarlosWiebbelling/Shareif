const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

const ecies = require('ecies-lite');
const ecdh = crypto.createECDH('secp256k1');

class Block {
  constructor(timestamp, toAddress, fromAddress, message, previousHash = '') {
    this.timestamp = timestamp;
    this.toAddress = toAddress;
    this.fromAddress = fromAddress;
    this.message = message;
    this.previousHash = previousHash;
  }

  encrypt(publicKey) {
    this.message = ecies.encrypt(publicKey, Buffer.from(this.message));
    this.calculateHash();
  }

  decrypt(privateKey) {
    return ecies.decrypt(ecdh.getPrivateKey(), this.message);
  }

  calculateHash() {
    this.hash = crypto
      .createHash('sha256')
      .update(this.previousHash + this.timestamp + this.message)
      .digest('hex');
  }

  signTransaction(privateKey) {
    if (this.toAddress === this.fromAddress)
      throw new Error('You cannot send messages to yourself!');

    this.encrypt(this.message, privateKey);
    this.calculateHash();
  }

  isValid(previousBlock) {
    if (this.previousHash !== previousBlock.hash) return false;
    return true;
  }

  getMessage(privateKey) {
    return this.decrypt(this.message, privateKey);
  }

  static generateKeyPair() {
    let ecdh = crypto.createECDH('secp256k1');
    ecdh.generateKeys();
    return {
      publicKey: ecdh.getPublicKey('hex'),
      privateKey: ecdh.getPrivateKey('hex')
    }
  }
}

module.exports = Block;
