var express = require('express');
var router = express.Router();
var fs = require('fs');
var braintree = require('braintree');
var mailgun = require('mailgun-js')({apiKey: 'key-d141be8ca986a254ab9e272aaffbc592', domain: 'forsyththeatre.com'});
var mysql = require('mysql');

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'cwznyw6q4qvn6rxk',
    publicKey: 'vry5k83ymbh6wnnx',
    privateKey: '040965d85dd2b82bb5cf3cbef251053f'
});

var pool = mysql.createPool({
    host: 'bhs1.hosting.jaredbates.net',
    user: 'forsythtickets',
    password: 'w4Qh3kseUg7UJJFp',
    database: 'forsythtickets_qa'
});

router.get('/shows', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) console.error(err);
        connection.query('SELECT * FROM `shows`;', function(err, rows, fields) {
            connection.release();
            if (err) console.error(err);

            res.json(rows);
        });
    });
});

router.get('/shows/:id', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) console.error(err);
        connection.query('SELECT * FROM `shows` WHERE `id` = ?;', [req.params.id], function(err, rows, fields) {
            connection.release();
            if (err) console.error(err);

            if (rows[0]) {
                res.json(rows[0]);
            } else {
                res.json({
                    error: 'Could not retrieve show.'
                });
            }
        });
    });
});

router.get('/token', function(req, res) {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) console.error(err);

        res.json({
            "clientToken": response.clientToken
        });
    });
});

router.post('/checkout', function(req, res) {
    gateway.transaction.sale({
        amount: req.body.seats.split(',').length * 5,
        paymentMethodNonce: req.body.paymentMethodNonce,
        customer: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone
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
    }, function(err, result) {
        if (err) console.error(err);

        if (result.success) {
            var transaction = result.transaction;

            res.json({
                "confirmationNumber": transaction.id,
                "card": {
                    "last4": transaction.creditCard.last4,
                    "type": transaction.creditCard.cardType
                }
            });

            mailgun.messages().send({
                from: 'Forsyth Theatre <mail@forsyththeatre.com>',
                to: transaction.customer.email,
                subject: 'Ticket Confirmation ' + transaction.id,
                text: 'Thank you for purchasing tickets for Into the Woods! Your confirmation number is ' + transaction.id + '. You will need this number when picking up tickets in the lobby. Here are the details of your transaction:'
            }, function(err, body) {
                if (err) throw err;
            });
        }
    });
});

module.exports = router;