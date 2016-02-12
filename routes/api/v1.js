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
        amount: req.body.amount,
        paymentMethodNonce: 'fake_valid_nonce'/*req.body.payment_method_nonce*/
    }, function (err, result) {
        if (err) throw err;

        var confirmationNumber = ((Math.random() * 1000000)) + 1;

        if (result.success) {
            console.log('Debug 1');
            res.json({
                "confirmationNumber": confirmationNumber,
                "card": {
                    "last4": result.creditCard.last4,
                    "type": result.creditCard.cardType
                }
            });
        }
    });
});

module.exports = router;