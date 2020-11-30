const expect = require('chai').expect;
const validIban = require('../../utils/iban');

describe( 'iban is valid', function () {
    it('should be true with SE35 5000 0000 0549 1000 0003',function () {
        expect(validIban('SE35 5000 0000 0549 1000 0003')).to.be.true;
    });

    it('should be true with ch93 0076 2011 6238 5295 7 ',function () {
        expect(validIban('ch93 0076 2011 6238 5295 7 ')).to.be.true;
    });

    it('should be false with ch93 0076 2001 6238 5295 7 ',function () {
        expect(validIban('ch93 0076 2001 6238 5295 7 ')).to.be.false;
    });

    it('should be false with 123',function () {
        expect(validIban('123')).to.be.false;
    });

    it('should be false with true',function () {
        expect(validIban(true)).to.be.false;
    });

});