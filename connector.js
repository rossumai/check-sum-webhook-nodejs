const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const port = 8000;
const tolerance = 0.00001;

app.use(bodyParser.json());
app.use(morgan('combined'));

const findByPath = (data, [part, ...parts]) => {
  const found = data.find(({ schema_id }) => (part === schema_id));
  return (found.children && parts.length) ? findByPath(found.children, parts) : found;
};

const createErrorMessages = (id, content) => [{ id, type: 'error', content }];

const trycatch = (fn) => (data) => {
  try { return fn(data); } catch (e) { return createErrorMessages('all', 'Error parsing annotation'); }
};

const floatValue = ({ value }) => parseFloat(value);

function vatSumCheck(vatTotal, vatDetails) {
  const sum = vatDetails.reduce((s, i) => s + floatValue(findByPath(i.children, ['vat_detail_tax'])), 0);
  return Math.abs(sum - floatValue(vatTotal)) <= tolerance;
}

const validate = trycatch(({ content }) => {
  const vatTotal = findByPath(content, ['amounts_section', 'amount_total_tax']);
  const vatDetails = findByPath(content, ['amounts_section', 'vat_details']);
  return vatSumCheck(vatTotal, vatDetails.children)
    ? []
    : createErrorMessages(vatTotal.id, 'Total VAT amount differs from sum of VAT amounts');
});

app.post('/validate', (request, response) => {
  const messages = validate(request.body);
  response.json({ messages });
});

app.post('/save', (request, response) => {
  response.json({});
});

app.get('/healthz', (request, response) => {
  response.status(204).send();
});

app.listen(port);

module.exports = app;
