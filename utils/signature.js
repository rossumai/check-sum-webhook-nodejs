const crypto = require('crypto');
const bufferEq = require('buffer-equal-constant-time');

const verifySignature = (signature, secretKey, payload) => {
    const retrievedSignature = signature.split('=');
    if (retrievedSignature[0] !== 'sha1') {
        return false;
    }

    const bodyString = Buffer.from(payload);
    const hmac = crypto.createHmac('sha1', secretKey).update(bodyString).digest('hex');
    return bufferEq(new Buffer.from(hmac), new Buffer.from(retrievedSignature[1]));
};

module.exports = verifySignature;
