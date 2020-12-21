const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './.env' });
const doc = require('./utils/document');

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;
const our_bank_acc = process.env.BANK_ACC || '150342342340';

const trycatch = fn => data => {
    try { return fn(data); } catch (e) { return doc.createMessage('error', 'Something went wrong ' + e); }
};

const floatValue = v => parseFloat( v.normalized_value );

const validate = trycatch(payload => {
    const { content } = payload.annotation;
    const schemaIds = [ 'amount_total_tax', 'tax_detail_tax', 'account_num' ];
    const data = doc.extract( content, schemaIds );

    const amount = data.values('amount_total_tax')
        .map( floatValue )
        .reduce( (res, dp) => res + dp, 0 );

    const detailSum = data.values('tax_detail_tax')
        .map( floatValue )
        .reduce( (res, dp) => res + dp, 0 );

    const messages = [];
    if( amount !== detailSum ) {
        messages.push(doc.createMessage( 'warning', 'Tax checksum failed', data.idOf('amount_total_tax')));
    }

    const accCheck = data.verify(['account_num'], 'Missing');
    if( accCheck.length > 0 ) {
        messages.push(accCheck);
    } else {
        const accountNum = data.firstValue('account_num');
        if (accountNum !== our_bank_acc) {
            messages.push(doc.createMessage('error', 'Bank account mismatch', data.idOf('account_num')));
        }
    }

    return messages;
});

app.use(bodyParser.json());
app.post('/check_vat_amounts', (request, response) => {
    const validationResult = validate( request.body );
    response.json( { messages: validationResult }  );
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on port: ${port}`);
});

module.exports = app;
