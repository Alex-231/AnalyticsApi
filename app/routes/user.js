var express = require('express');
var router = express.Router();
var passport = require('passport');
var Client = require('../models/Client')
var clientRoutes = require('./client');

// app/routes.js

router.post('/clients',
    passport.isLoggedIn,
    function(req, res) {

        var clients = Array();

        for (var i = 0, len = req.user.clients.len; i < len; i++) {
            var client = clientRoutes.getClientById(req.user.clients[i])
            if (client)
                clients.push(client);
        }

        res.send(req.user.clients);

    });


module.exports = router;