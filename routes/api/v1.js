var express = require('express');
var router = express.Router();
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var mysql = require('mysql');

var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
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

router.post('/checkout', function(req, res) {
    var seats = req.body.seats.split(',');
    stripe.charges.create({
        amount: ((req.body.studentSeatsAmount * req.body.studentPrice) + (req.body.adultSeatsAmount * req.body.adultPrice) + 1).toFixed(2) * 100,
        currency: 'USD',
        source: req.body.stripeToken,
        description: seats.length + ' Ticket' + (seats.length > 1 ? 's' : '')
    }, function(err, charge) {
        if (err) console.error(err);

        pool.getConnection(function(err, connection) {
            if (err) console.error(err);

            seats.forEach(function(seat) {
                var insert = {transactionid: charge.id, showid: req.body.showID, seat: seat};
                connection.query('INSERT INTO `purchased_seats` SET ?;', insert);
            });

            connection.release();
        });

        res.json({
            "card": {
                "last4": charge.source.last4,
                "type": charge.source.brannd
            }
        });
    });
});

module.exports = router;