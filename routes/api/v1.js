var express = require('express');
var router = express.Router();
var fs = require('fs');
var braintree = require('braintree');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'cwznyw6q4qvn6rxk',
    publicKey: 'vry5k83ymbh6wnnx',
    privateKey: '040965d85dd2b82bb5cf3cbef251053f'
});

router.get('/token', function (req, res) {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) throw err;
        res.json({
            "clientToken": response.clientToken
        });
    });
});

router.post('/process', function (req, res) {
    gateway.customer.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        paymentMethodNonce: req.payment_method_nonce
    });
});

module.exports = router;