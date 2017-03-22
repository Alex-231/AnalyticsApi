var express = require('express');
var router = express.Router();
var passport = require('passport');
var Client = require('../models/Client');
var databaseUtils = require('../util/databaseUtils');
var routerUtils = require('../util/routerUtils');

router.post('/add', routerUtils.isLoggedIn, function(req, res) {

    var newClient = new Client();

    newClient.name = req.body.clientName;
    // newClient.apiTokens.facebookToken = req.body.facebookToken;
    // newClient.apiTokens.twitterToken = req.body.twitterToken;
    // newClient.apiTokens.instagramToken = req.body.instagramToken;
    // newClient.apiTokens.googleToken = req.body.googleToken;

    newClient.save(function(err) {
        if (err)
            res.send("Error saving new client: " + err);
        else
            res.send("Saved new client.");
    });
});

router.get('/:id', routerUtils.isLoggedIn, function(req, res) {

    var client = databaseUtils.getClientById(req.params.id);
    if (client)
        res.send(client);
    else
        res.send("Client not found");

});

router.post('/:id/setup/facebook', routerUtils.isLoggedIn, function(req, res) {

    //Does the user have permission to do this?
    if (req.user.role == 'Client') {
        var clientFound = false;
        for (var client in req.user.clients) {
            if (client == req.params.id);
            clientFound = true;
        }

        if (!clientFound)
            res.send("You don't have permission to do this.");
    } else if (req.user.role = 'Admin') {
        res.send("You don't have permission to do this.");
    }

    Client.findById(req.params.id, function(err, client) {
        if (err)
            res.send(err);
        else if (!client)
            res.send("Client not found");
        else {
            client.apiTokens.facebook.appID = req.body.appID;
            client.apiTokens.facebook.appSecret = req.body.appSecret;
            client.save();

            res.send("Updated client.");
        }

    })

    //Go to oauth.


})

router.post('/find/:name', routerUtils.isLoggedIn, function(req, res) {

    Client.findOne({ name: req.params.name },

        function(err, client) {
            if (err)
                res.send(err);
            else if (!client)
                res.send("Client not found.");
            else
                res.send(client._id);
        });

})

module.exports = router;