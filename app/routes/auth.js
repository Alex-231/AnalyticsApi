var express = require('express');
var router = express.Router();
var passport = require('passport');

// app/routes.js

router.post('/signup',
    passport.authenticate('local-signup'),
    function(req, res) {
        res.send(req.user);
    });

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/login', passport.authenticate('local-login'), function(req, res) {
    res.send(req.isAuthenticated);
});


module.exports = router;