var express = require('express');
var router = express.Router();
var fs = require('fs');
var braintree = require('braintree');

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

router.post('/checkout', function (req, res) {
    gateway.transaction.sale({
        amount: '5.00',
        paymentMethodNonce: req.body.payment_method_nonce,
        customer: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email
        },
        billing: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            streetAddress: req.body.address,
            locality: req.body.city,
            region: req.body.state,
            postalCode: req.body.zip,
            countryCodeAlpha2: 'US'
        },
        options: {
            submitForSettlement: true
        }
    }, function (err, result) {
        if (err) throw err;

        if (result.success) {
            var transaction = result.transaction;
            res.json({
                "confirmationNumber": transaction.id,
                "card": {
                    "last4": transaction.creditCard.last4,
                    "type": transaction.creditCard.cardType
                }
            });
        } else {
            res.send('Sorry, but the transaction failed.');
        }
    });
});

module.exports = router;