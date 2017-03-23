var express = require('express');
var router = express.Router();
var passport = require('passport');
var Client = require('../models/Client')
var clientRoutes = require('./client');
var routerUtils = require('../util/routerUtils');
var databaseUtils = require('../util/databaseUtils');

// app/routes.js

router.post('/clients',
    routerUtils.isLoggedIn,
    function(req, res) {

        var responseObject = {};
        var clients = Array();

        for (var i = 0, len = req.user.clients.len; i < len; i++) {
            var client = clientRoutes.getClientById(req.user.clients[i]);
            if (client)
                clients.push(client);
        }


        responseObject.message = req.user.clients;
        responseObject.success = true;
        res.send(responseObject);

    });


module.exports = router;