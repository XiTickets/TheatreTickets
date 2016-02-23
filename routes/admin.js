var express = require('express');
var router = express.Router();
var basicAuth = require('basic-auth');

router.get('/*', function(req, res, next) {
    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }
    if (user.name === 'pos' && user.pass === '') {
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    }
});

router.get('/chart', function(req, res) {
    res.send('Test');
});

module.exports = router;