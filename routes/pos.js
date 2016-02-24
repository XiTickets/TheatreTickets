var express = require('express');
var router = express.Router();
var basicAuth = require('basic-auth');

router.get('/*', function(req, res, next) {
    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Please log into POS');
        res.sendStatus(401);
        return;
    }

    if (user.name === 'pos' && user.pass === 'password') {
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm=Please log into POS');
        res.sendStatus(401);
    }
});

router.get('/', function(req, res) {
    res.send('Incorrect POS url. Please browse to one of the following:<br><br>/pos/{showid}/chart<br>/pos/{showid}/checkout');
});

router.get('/:showid/chart', function(req, res) {
    res.render('pos/chart', {
        showID: req.params.showid
    });
});

module.exports = router;