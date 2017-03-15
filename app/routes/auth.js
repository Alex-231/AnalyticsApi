var express = require('express');
var router = express.Router();
var passport = require('passport');
//var AdminSchema = require('../models/User')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

router.post('/register', function(req, res) {

    res.send({ success: true, message: 'Register client route.' });
});

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