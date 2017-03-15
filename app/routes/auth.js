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

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
}));


module.exports = router;