var express = require('express');
var router = express.Router({ mergeParams: true });
var passport = require('passport');
var Client = require('../../models/Client');
var request = require('request');
var databaseUtils = require('../../util/databaseUtils');
var routerUtils = require('../../util/routerUtils');

var facebookAnalyticsProvider = require('../../util/analytics/facebookAnalyticsProvider'); //Not sure why this F is lower case...
var instagramAnalyticsProvider = require('../../util/analytics/InstagramAnalyticsProvider');

var AnalyticsProviders = [];

//Creates instances of each analytics provider, returns an array.
function InstanceAnalyticsProviders(client) {

    var analyticsProviders = [];
    //This is where analytics providers can be added.
    analyticsProviders.push(new facebookAnalyticsProvider(client._id));
    analyticsProviders.push(new instagramAnalyticsProvider(client._id));
    //AnalyticsProviders.push(new TwitterAnalyticsProvider(client.apiTokens.twitter.token));

    return analyticsProviders;
}

router.get('/refresh', routerUtils.isLoggedIn, function(req, res) {
    var responseObject = {}; //Declare the response...

    //Find the client by the ID in the URL.
    Client.findById(req.params.clientId, function(err, client) {
        if (err !== null) { //If there's an error, respond with it.
            responseObject.success = false;
            responseObject.error = err;
            res.send(responseObject);
        } else if (client === null) { //If no client was found, respond.
            responseObject.success = false;
            responseObject.error = "No client found";
            res.send(responseObject);
        } else { //If a client was found, refresh their stats.
            responseObject.success = true;
            responseObject.message = "Refreshing stats for client '" + client.name + "'";

            var analyticsProviders = InstanceAnalyticsProviders(client); //Instance all of the analytics providers.

            //Respond.
            res.send(responseObject);

            //Loop through the analytics providers, gather their likes.
            for (var i = 0; i < analyticsProviders.length; i++) {
                analyticsProviders[i].getLikes();
                analyticsProviders[i].getPostLikes();
                analyticsProviders[i].getFollowers();
            }
        }
    });
});

router.get('/followers', routerUtils.isLoggedIn, function(req, res) {
    var responseObject = {};

    //Find the client by the ID in the URL.
    Client.findById(req.params.clientId, function(err, client) {
        if (err !== null) { //If there's an error, respond with it.
            responseObject.success = false;
            responseObject.error = err;
            res.send(responseObject);
        } else if (client === null) { //If no client was found, respond.
            responseObject.success = false;
            responseObject.error = "No client found";
            res.send(responseObject);
        } else { //If a client was found, refresh their stats.
            responseObject.success = true;
            responseObject.message = "Successfully retrieved followers for'" + client.name + "'";
            responseObject.data = [{}];

            for (var i = 0; i < client.cachedAnalytics.length; i++) {
                responseObject.data.push({ provider: client.cachedAnalytics[i].provider, followers: client.cachedAnalytics[i].followers });
            }

            //Respond.
            res.send(responseObject);
        }
    });
});

router.get('/likes', routerUtils.isLoggedIn, function(req, res) {
    var responseObject = {};

    //Find the client by the ID in the URL.
    Client.findById(req.params.clientId, function(err, client) {
        if (err !== null) { //If there's an error, respond with it.
            responseObject.success = false;
            responseObject.error = err;
            res.send(responseObject);
        } else if (client === null) { //If no client was found, respond.
            responseObject.success = false;
            responseObject.error = "No client found";
            res.send(responseObject);
        } else { //If a client was found, refresh their stats.
            responseObject.success = true;
            responseObject.message = "Successfully retrieved likes for'" + client.name + "'";
            responseObject.data = [{}];

            for (var i = 0; i < client.cachedAnalytics.length; i++) {
                responseObject.data.push({ provider: client.cachedAnalytics[i].provider, likes: client.cachedAnalytics[i].likes });
            }

            //Respond.
            res.send(responseObject);
        }
    });
});

router.get('/posts', routerUtils.isLoggedIn, function(req, res) {
    var responseObject = {};

    //Find the client by the ID in the URL.
    Client.findById(req.params.clientId, function(err, client) {
        if (err !== null) { //If there's an error, respond with it.
            responseObject.success = false;
            responseObject.error = err;
            res.send(responseObject);
        } else if (client === null) { //If no client was found, respond.
            responseObject.success = false;
            responseObject.error = "No client found";
            res.send(responseObject);
        } else { //If a client was found, refresh their stats.
            responseObject.success = true;
            responseObject.message = "Successfully retrieved posts for'" + client.name + "'";
            responseObject.data = [{}];

            for (var i = 0; i < client.cachedAnalytics.length; i++) {
                responseObject.data.push({ provider: client.cachedAnalytics[i].provider, posts: client.cachedAnalytics[i].posts });
            }

            //Respond.
            res.send(responseObject);
        }
    });
});

module.exports = router;