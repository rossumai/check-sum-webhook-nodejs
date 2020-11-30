const express = require('express');
const bodyParser = require('body-parser');
const doc = require('./utils/document');

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

const trycatch = fn => data => {
    try { return fn(data); } catch (e) { return doc.createMessage('error', 'Something went wrong ' + e); }
};

const floatValue = v => parseFloat( v.content.normalized_value );

const validate = trycatch(payload => {
    const content = payload.annotation.content;
    const schemaIds = [ 'amount_total_tax', 'tax_detail_tax' ];
    const data = doc.findBySchemaIdBulk( content, schemaIds );

    const amount = data.amount_total_tax
        .map( floatValue )
        .reduce( (res, dp) => res + dp, 0 );

    const detailSum = data.tax_detail_tax
        .map( floatValue )
        .reduce( (res, dp) => res + dp, 0 );

    const messages = [];
    if( amount !== detailSum && data.amount_total_tax.length > 0 ) {
        messages.push(doc.createMessage( 'warning', 'Tax checksum failed', data.amount_total_tax[0].id ));
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
    console.log(`> Ready on http://localhost:${port}`);
});

module.exports = app;
