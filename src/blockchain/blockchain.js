const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    let genesis = new Block(
      1576016676528,
      '049e6d7c3632e3a61f7d33423b7829c1ec5a3b7f29ff2db5908f5d1bbaa81a7c0895983634697c2596c832c81a4b94bf11a7d19a56e6df8a38df6af0a46360cecf',
      'f9b8940cd4c4571942867ec73b273b1c1b5da055b8ba5cc7e3518681cb5e7023',
      'SHAREIF GENESIS BLOCK:\n toAddress: Here is the general channel public key,\n fromAddress: Here is the general channel private key',
      '[object Object] Not Found // DogeLife'
    );
    genesis.height = 0;
    genesis._calculateHash();
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
    if (!(block instanceof Block)) throw new Error('Invalid prototype');
    if (!this.isChainValid()) throw new Error('Invalid chain');
    if (!block.isValid(this.getLatestBlock())) throw new Error('Invalid block');

    if (!block.fromAddress || !block.toAddress)
      throw new Error('Message must include from and to address');

    if (block.message >= 0 && block.message <= 140)
      throw new Error(
        'Message length should meet the specifications(0 to 140 characteres).'
      );

    block.height = this.chain.length
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

  compareHeights(block) {
    if (!(block instanceof Block)) throw new Error('Invalid prototype');
    if (block.height < this.getLatestBlock.height) {
      const blocks = [];
      for (let remaining = block.height; remaining > 0; remaining--) {
        blocks.push(this.chain[this.chain.length - remaining]);
      }
      return blocks;
    }
  }
}

module.exports = Blockchain;
