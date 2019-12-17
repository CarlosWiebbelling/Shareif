const crypto = require('crypto');
const ecies = require('ecies-lite');

class Block {
  constructor(timestamp, toAddress, fromAddress, message, previousHash = '') {
    this.timestamp = timestamp;
    this.toAddress = toAddress;
    this.fromAddress = fromAddress;
    this.message = message;
    this.previousHash = previousHash;
  }

  getMessage(privateKey) {
    try {
      const msg = this._decrypt(privateKey);
      if (msg)
        return msg.toString();
    } catch (err) {
      console.error(err);
    }
  }

  sign(publicKey) {
    try {
      this._encrypt(publicKey);
      this._calculateHash();

    } catch (err) {
      console.error(err);
    }
  }

  isValid(previousBlock) {
    try {
      if (this.previousHash !== previousBlock.hash) return false;
      return true;
    } catch (err) {
      console.error(err);
    }
  }

  _encrypt(publicKey) {
    try {
      const data = ecies.encrypt(
        Buffer.from(publicKey, 'hex'),
        Buffer.from(this.message)
      );

      this.message = {
        epk: data.epk.toString('hex'),
        iv: data.iv.toString('hex'),
        ct: data.ct.toString('hex'),
        mac: data.mac.toString('hex')
      };

    } catch (err) {
      console.error(err);
    }
  }

  _decrypt(privateKey) {
    try {
      const data = {
        epk: Buffer.from(this.message.epk, 'hex'),
        iv: Buffer.from(this.message.iv, 'hex'),
        ct: Buffer.from(this.message.ct, 'hex'),
        mac: Buffer.from(this.message.mac, 'hex')
      };

      return ecies.decrypt(
        Buffer.from(privateKey, 'hex'),
        data
      );
    } catch (err) {
      console.error(err);
    }
  }

  _calculateHash() {
    try {
      this.hash = crypto
        .createHash('sha256')
        .update(this.previousHash + this.timestamp + this.message)
        .digest('hex');
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Block;
