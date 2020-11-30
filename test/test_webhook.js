const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const server = require('../webhook');

chai.use(chaiHttp);
chai.should();

// Unit tests
require('./utils/document');
require('./utils/iban');
require('./utils/signature');

describe('/check_vat_amounts', () => {

    const data = fs.readFileSync('./test/data/sample-data.json', {encoding: 'utf8'});
    const json = JSON.parse(data);
    const jsonError = JSON.parse(data);
    jsonError.annotation.content[2].children[6].children[0].children[2].content.normalized_value = '242';

    it('it should not return messages when tax rows match', (done) => {
        chai.request(server)
            .post('/check_vat_amounts')
            .type('json')
            .send(json)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('messages');
                res.body.messages.should.be.empty;
                done();
            });
    });

    it('it should return messages when tax rows don\'t match', (done) => {
        chai.request(server)
            .post('/check_vat_amounts')
            .type('json')
            .send(jsonError)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('messages');
                res.body.messages.should.be.be.ofSize(1);
                done();
            });
    });
});
