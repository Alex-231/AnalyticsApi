var express = require('express');
var router = express.Router();
var passport = require('passport');

//LOCAL AUTHENTICATION ROUTES

router.post('/signup',
    passport.authenticate('local-signup'),
    function(req, res) {
        var responseObject = {};
        if (req.isAuthenticated) {
            responseObject.success = true;
            responseObject.message = "Signup Successful! Authenticated!";
        } else {
            responseObject.success = false;
            responseObject.message = "Failed to signup.";
        }
        res.send(responseObject);
    });

router.get('/logout', function(req, res) {
    var responseObject = {};
    req.logout();
    responseObject.success = true;
    responseObject.message = "Sucessfully logged out.";
    res.send(responseObject);
});

router.post('/login', passport.authenticate('local-login'), function(req, res) {
    var responseObject = {};
    if (req.isAuthenticated) {
        responseObject.success = true;
        responseObject.message = "Login Successful! Authenticated!";
    } else {
        responseObject.success = false;
        responseObject.message = "Failed to login.";
    }
    res.send(responseObject);
});


module.exports = router;