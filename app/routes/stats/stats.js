var express = require('express');
var router = express.Router({ mergeParams: true });
var passport = require('passport');
var Client = require('../../models/Client');
var request = require('request');
var databaseUtils = require('../../util/databaseUtils');
var routerUtils = require('../../util/routerUtils');

var facebookAnalyticsProvider = require('../../util/analytics/facebookAnalyticsProvider');

var AnalyticsProviders = [];

//Creates instances of each analytics provider, returns an array.
function InstanceAnalyticsProviders(client) {
    "use strict"; //This function uses classes, which are strict.

    var analyticsProviders = [];
    //This is where analytics providers can be added.
    analyticsProviders.push(new facebookAnalyticsProvider(client._id));
    //AnalyticsProviders.push(new TwitterAnalyticsProvider(client.apiTokens.twitter.token));

    return analyticsProviders;
}

router.get('/refresh', function(req, res) {
    var responseObject = {};
    var analyticsProviders;

    Client.findById(req.params.clientId, function(err, client) {
        if (err !== null) {
            responseObject.success = false;
            responseObject.error = err;
        } else if (client === null) {
            responseObject.success = false;
            responseObject.error = "No client found";
        } else {
            responseObject.success = true;
            responseObject.message = "Refreshing stats for client '" + client.name + "'";

            analyticsProviders = InstanceAnalyticsProviders(client);

            for (var i = 0; i < analyticsProviders.length; i++) {

                analyticsProviders[i].getLikes();
            }
        }
    });
});

// router.get('/likes', /*routerUtils.isLoggedIn,*/ function(req, res) {

//     var responseObject = {};
//     var analyticsProviders;
//     var totalLikes = 0;

//     Client.findById(req.params.clientId, function(err, client) {
//         if (err !== null) {
//             responseObject.success = false;
//             responseObject.error = err;
//         } else if (client === null) {
//             responseObject.success = false;
//             responseObject.error = "No client found";
//         } else {
//             analyticsProviders = InstanceAnalyticsProviders(client);

//             for (var i = 0; i < analyticsProviders.length; i++) {

//                 request('http://www.modulus.io', testfunc);

//                 // request('http://www.modulus.io', function(error, response, body) {
//                 //     console.log(analyticsProviders[i].name);
//                 //     if (!error && response.statusCode == 200) {
//                 //         console.log(body); // Show the HTML for the Modulus homepage.
//                 //     }
//                 // });

//                 var likes = 0;

//                 likes = analyticsProviders[i].likes();

//                 console.log(likes);

//                 totalLikes += likes;

//                 responseObject[analyticsProviders[i].name] = likes;
//             }

//             responseObject.total = totalLikes;
//             console.log(JSON.stringify(responseObject));
//         }
//         res.send(JSON.stringify(responseObject));
//     });
// });

module.exports = router;