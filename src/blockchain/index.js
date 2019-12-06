const Blockchain = require("./blockchain");
const Block = require('./block');

module.exports = { Blockchain, Block };

// const crypto = require("crypto");
// const LENGTH = 256;

// const shareif = new Blockchain();

// const addBlock = block => {
//   block.encrypt(block.message, shareif.mainChannel.privateKey);
//   shareif.addMessage(block);
// };

// Users
// const user2 = crypto.createDiffieHellman(LENGTH);
// user2.generateKeys("hex");

// Chat 1
// addBlock(
//   new Block(
//     Date.parse("2017-01-01"),
//     shareif.mainChannel.publicKey,
//     user2.getPublicKey("hex"),
//     "Batata frita",
//     shareif.getLatestBlock().hash
//   )
// );
// addBlock(
//   new Block(
//     Date.parse("2017-01-01"),
//     shareif.mainChannel.publicKey,
//     user2.getPublicKey("hex"),
//     "Batata frita fritinha fritosa frituda lorem ipsum dolor sit amet oloquinho meu esse texto ta ficando muito chato de escrever na moral",
//     shareif.getLatestBlock().hash
//   )
// );

// console.log(shareif.getLatestBlock().getMessage("shareifPrivateKey"));

// newBlock.signTransaction(shareif.mainChannel.privateKey);

// shareif.addMessage(newBlock);
