var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY});
});

module.exports = router;
