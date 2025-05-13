const crypto = require('crypto');
require('dotenv').config();
const SECRET = process.env.SIGN_SECRET || '__000';

function signProductId(productId) {
  const hash = crypto
    .createHmac('sha256', SECRET)
    .update(productId.toString())
    .digest('hex');

  return `${productId}:${hash}`;
}

function verifyProductToken(token) {
  const [productId, hash] = token.split(':');
  const expected = crypto
    .createHmac('sha256', SECRET)
    .update(productId)
    .digest('hex');

  if (hash === expected) {
    return productId;
  } else {
    throw new Error('Invalid or tampered product ID');
  }
}

module.exports = { signProductId, verifyProductToken };
