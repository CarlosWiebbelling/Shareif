const crypto = require("crypto");
const algorithm = "aes-256-ctr";
const ALGORITHM = "aes-256-gcm";

class Block {
  constructor(timestamp, toAddress, fromAddress, message, previousHash = "") {
    this.timestamp = timestamp;
    this.toAddress = toAddress;
    this.fromAddress = fromAddress;
    this.message = message;
    this.previousHash = previousHash;
  }

  encrypt(text, password) {
    const iv = Buffer.alloc(48, 0);
    // let cipher = crypto.createCipheriv(ALGORITHM, password, iv);
    let cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    this.message = crypted;
    this.calculateHash();
  }

  decrypt(text, password) {
    const iv = Buffer.alloc(48, 0);
    // let decy = crypto.createDecipheriv(ALGORITHM, password, iv);
    let decy = crypto.createDecipher(algorithm, password);
    let message = decy.update(text, "hex", "utf8");
    message += decy.final("utf8");
    return message;
  }

  calculateHash() {
    this.hash = crypto
      .createHash("sha256")
      .update(this.previousHash + this.timestamp + this.message)
      .digest("hex");
  }

  signTransaction(privateKey) {
    if (this.toAddress === this.fromAddress)
      throw new Error("You cannot send messages to yourself!");

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
}

module.exports = Block;
