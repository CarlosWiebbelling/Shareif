const crypto = require("crypto");
const algorithm = "aes-256-ctr";
const ALGORITHM = "aes-256-gcm";

class Block {
  constructor(timestamp, toAddress, fromAddress, message, previousHash = "") {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.toAddress = toAddress;
    this.fromAddress = fromAddress;
    this.message = message;
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

class Blockchain {
  constructor() {
    this.mainChannel = {
      publicKey: "shareifPublicKey",
      privateKey: "shareifPrivateKey"
    };
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    let genesis = new Block(
      Date.parse("2017-01-01"),
      "127.0.0.1",
      "192.168.0.1",
      "Hello! Welcome to Shareif.",
      this.mainChannel.publicKey
    );
    genesis.calculateHash();
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
    if (!this.isChainValid()) throw new Error("Invalid Chain");

    if (!block.isValid(this.getLatestBlock())) throw new Error("Block invalid");

    if (!block.fromAddress || !block.toAddress)
      throw new Error("Message must include from and to address");

    if (block.message >= 0 && block.message <= 140)
      throw new Error(
        "Message length should meet the specifications(0 to 140 characteres)."
      );

    this.chain.push(block);
  }

  getAllMessages(address) {
    const messages = [];

    for (const block of this.chain)
      if (block.toAddress === address) messages.push(block);

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
      if (!currentBlock.isValid(this.chain[i - 1])) {
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
