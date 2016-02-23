var express = require('express');
var router = express.Router();
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

router.get('/shows/:id/purchased_seats', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) console.error(err);
        connection.query('SELECT * FROM `purchased_seats` WHERE `showid` = ?;', [req.params.id], function(err, rows, fields) {
            connection.release();
            if (err) console.error(err);

            if (rows[0]) {
                var purchasedSeatIDs = [];

                rows.forEach(function(purchasedSeats) {
                    purchasedSeatIDs.push(purchasedSeats.seat);
                });

                res.json(purchasedSeatIDs);
            } else {
                res.json({
                    error: 'Could not retrieve purchased seats.'
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
    var seats = req.body.seats.split(',');
    gateway.transaction.sale({
        amount: req.body.price,
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

            pool.getConnection(function(err, connection) {
                if (err) console.error(err);

                seats.forEach(function(seat) {
                    var insert = {transactionid: transaction.id, showid: req.body.showid, seat: seat};
                    connection.query('INSERT INTO `purchased_seats` SET ?;', insert);
                });

                connection.release();
            });

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
                text: 'Thank you for purchasing tickets for ' + req.body.showname + '! Your confirmation number is ' + transaction.id + '. Please keep this for your records.'
            }, function(err, body) {
                if (err) console.error(err);
            });
        }
    });
});

module.exports = router;