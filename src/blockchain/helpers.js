const crypto = require('crypto');
const ecdh = crypto.createECDH('secp256k1');

function generateKeyPair() {
  try {
    ecdh.generateKeys();

    return {
      publicKey: ecdh.getPublicKey('hex'),
      privateKey: ecdh.getPrivateKey('hex')
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = { generateKeyPair };
