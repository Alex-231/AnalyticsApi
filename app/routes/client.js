var express = require('express');
var router = express.Router();
var passport = require('passport');
var Client = require('../models/Client');
var databaseUtils = require('../util/databaseUtils');
var routerUtils = require('../util/routerUtils');

router.post('/add', routerUtils.isLoggedIn, function(req, res) {

    var newClient = new Client();

    newClient.name = req.body.name;
    newClient.emails = [req.body.email];
    // newClient.apiTokens.facebookToken = req.body.facebookToken;
    // newClient.apiTokens.twitterToken = req.body.twitterToken;
    // newClient.apiTokens.instagramToken = req.body.instagramToken;
    // newClient.apiTokens.googleToken = req.body.googleToken;

    newClient.save(function(err) {
        if (err) {
            responseObject.message = "Error saving new client: " + err;
            responseObject.success = false;
        } else {
            responseObject.message = "Saved new client.";
            responseObject.success = true;
        }
    });
    res.send(responseObject);
});

router.get('/:id', routerUtils.isLoggedIn, function(req, res) {

    var responseObject = {};

    var client = databaseUtils.getClientById(req.params.id);
    if (client) {
        responseObject.message = "Successfully found user";
        responseObject.success = false;
        responseObject.data = client;
    } else {
        responseObject.message = "Client not found.";
        responseObject.success = false;
    }
    res.send(responseObject);

});

router.post('/:id/setup/facebook', routerUtils.isLoggedIn, function(req, res) {

    var responseObject = {};

    Client.findById(req.params.id, function(err, client) {
        if (err) {
            responseObject.message = err;
            responseObject.success = false;
        } else if (!client) {
            responseObject.message = "Client not found.";
            responseObject.success = false;
        } else {
            client.apiTokens.facebook.appID = req.body.appID;
            client.apiTokens.facebook.appSecret = req.body.appSecret;
            client.save();

            responseObject.message = "Updated Client";
            responseObject.success = true;
        }


    });

    res.send(responseObject);
    //go to auth

});

router.post('/find/:name', routerUtils.isLoggedIn, function(req, res) {

    var responseObject = {};

    Client.findOne({ name: req.params.name },

        function(err, client) {
            if (err) {
                responseObject.message = err;
                responseObject.success = false;
            } else if (!client) {
                responseObject.message = "No client found.";
                responseObject.success = false;
            } else {
                responseObject.data = client;
                responseObject.success = true;
                responseObject.message = "Found client " + req.params.name;
            }
        });

    res.send(responseObject);

})

module.exports = router;