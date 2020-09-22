const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const crypto = require('crypto');
const bufferEq = require('buffer-equal-constant-time')
const app = express();
const port = 8000;
const tolerance = 0.00001;
const secretKey = "Your secret key stored in hook.config.secret"  // never store this in code!

app.use(morgan('combined'));
app.use(bodyParser.json({verify:function(request,res,buf){request.rawBody=buf}}))

function verifySignature(request) {
  const retrievedSignature = request.get("X-Elis-Signature").split("=")
  const bodyString = Buffer.from(request.rawBody)
  if (retrievedSignature[0] !== "sha1") {
    return false
  }
  const hmac = crypto.createHmac('sha1', secretKey).update(bodyString).digest('hex')
  return bufferEq(new Buffer.from(hmac), new Buffer.from(retrievedSignature[1]));
};

const findByPath = (data, [part, ...parts]) => {
  const found = data.find(({ schema_id }) => (part === schema_id));
  return (found.children && parts.length) ? findByPath(found.children, parts) : found;
};

const createErrorMessages = (id, content) => [{ id, type: 'error', content }];

const trycatch = (fn) => (data) => {
  try { return fn(data); } catch (e) { return createErrorMessages('all', 'Error parsing annotation'); }
};

const floatValue = ({ content: { value } }) => parseFloat(value);

function vatSumCheck(vatTotal, vatDetails) {
  const sum = vatDetails.reduce((s, i) => s + floatValue(findByPath(i.children, ['tax_detail_tax'])), 0);
  return Math.abs(sum - floatValue(vatTotal)) <= tolerance;
};

const validate = trycatch(({ annotation }) => {
  const vatTotal = findByPath(annotation.content, ['amounts_section', 'amount_total_tax']);
  const vatDetails = findByPath(annotation.content, ['amounts_section', 'tax_details']);
  return vatSumCheck(vatTotal, vatDetails.children)
    ? []
    : createErrorMessages(vatTotal.id, 'Total VAT amount differs from sum of VAT amounts');
});

app.post('/check_vat_amounts', (request, response) => {
  let signatureCheck = verifySignature(request)
  if (signatureCheck === true) {
    const messages = validate(request.body);
    response.json({ messages });
  } else {
  throw Error("Unauthorized Request")
  }
});

app.listen(port);

module.exports = app;
