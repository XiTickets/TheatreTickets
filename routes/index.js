var express = require('express');
var router = express.Router();
var fs = require('fs');

var templates = {
    seatselection: fs.readFileSync('./views/pages/seatselection.ejs', 'utf-8'),
    checkout: fs.readFileSync('./views/pages/checkout.ejs', 'utf-8')
};

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Forsyth Tickets',
        templates: templates
    });
});

module.exports = router;
