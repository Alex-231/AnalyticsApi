var express = require('express');
var router = express.Router();
var passport = require('passport');
var Client = require('../models/Client');
var ApiTokens = require('../models/ApiTokens');

function getClientById(id) {
    Client.findById(id, function(err, client) {
        return client;
    })
}

router.post('/add', passport.isLoggedIn, function(req, res) {

    var newClient = new Client();

    newClient.apiTokens = new ApiTokens();

    newClient.name = req.body.clientName;
    newClient.apiTokens.facebookToken = req.body.facebookToken;
    newClient.apiTokens.twitterToken = req.body.twitterToken;
    newClient.apiTokens.instagramToken = req.body.instagramToken;
    newClient.apiTokens.googleToken = req.body.googleToken;

    newClient.save(function(err) {
        if (err)
            res.send("Error saving new client: " + err);
        else
            res.send("Saved new client.");
    });
});

router.get('/:id', passport.isLoggedIn, function(req, res) {

    var client = getClientById(req.params.id);
    if (client)
        res.send(client);
    else
        res.send("Client not found");

});

module.exports = router;