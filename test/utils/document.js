const chai = require('chai');
const assertArrays = require('chai-arrays');
chai.use(assertArrays);
const {expect} = require('chai');
const fs = require('fs');

const {
    createMessage,
    findBySchemaId,
    findBySchemaIdBulk,
    verifyInBulk,
    findInRir
} = require('../../utils/document');

describe('document library', function () {

    //////////  createMessage

    const message = createMessage('info', 'Test message');

    it('createMessage should create message', function () {
        expect(message).to.not.be.undefined;
    });

    it('createMessage should store the type', function () {
        expect(message).to.have.property('type');
    });

    it('createMessage should store the message', function () {
        expect(message).to.have.property('content');
    });

    //////////  findBySchemaId

    const data = fs.readFileSync('./test/data/sample-data.json', {encoding: 'utf8'});
    it('sample-data.json should have data',function () {
        expect(data).to.not.be.undefined;
    });

    const json = JSON.parse(data);
    it('sample-data.json should be JSON',function () {
        expect(json).to.not.be.undefined;
    });

    const content = json.annotation.content;
    it('sample-data.json should have content',function () {
        expect(content).to.not.be.undefined;
    });

    it('sample-data.json should contain item_amount_total fields 3x',function () {
        expect(findBySchemaId(content, 'item_amount_base' )).to.be.ofSize(3);
    });

    const bulkFind = findBySchemaIdBulk(content, ['item_amount_base'] );
    it('sample-data.json retrieved in bulk should contain item_amount_total fields 3x',function () {
        expect(bulkFind['item_amount_base']).to.be.ofSize(3);
    });

    it('bulk should provide valueOf method',function () {
        expect(bulkFind.valueOf('item_amount_base')).to.be.equal('645.53');
    });

    //////////  verify in bulk
    const bulk = findBySchemaIdBulk(content, ['item_amount_base', 'amount_rounding'] );
    const verification = verifyInBulk(bulk, ['item_amount_base', 'amount_rounding', 'missing_field'], 'Err: ${SCHEMA_ID}' );

    it('schemaId check found one missing field',function () {
        expect(verification).to.be.ofSize(1);
    });

    it('schemaId check fills the error message',function () {
        expect(verification[0].content).to.be.equal('Err: amount_rounding');
        expect(verification[0].id).to.be.equal(332573403);
    });

    //////////  findInRir
    it('sample-data.json should contain string "DNBANOKK" once',function () {
        expect(findInRir(content, 'DNBANOKK' )).to.be.ofSize(1);
    });
});