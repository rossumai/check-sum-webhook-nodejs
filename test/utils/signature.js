const expect = require('chai').expect;
const verifySignature = require('../../utils/signature');

describe( 'signature is valid', function () {
    const payload = '{ "message": "sign me", "someValue" = 45 }';  // Coming as the request body
    const sha = 'sha1=82673bc38c8eea236b04bad7fea3311a1e5b951c';   // Coming in the header field: X-Elis-Signature
    const secret = 'This is very secret';

    it('valid signature should pass',function () {
        expect(verifySignature(sha, secret, payload)).to.be.true;
    });
    it('wrong signature should fail',function () {
        expect(verifySignature('sha1=82673bc38c8e00000000bad0000000001e5b951c', secret, payload)).to.be.false;
    });
    it('wrong secret should fail',function () {
        expect(verifySignature(sha, 'Wrong secret', payload)).to.be.false;
    });

});