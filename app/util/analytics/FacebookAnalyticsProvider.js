"use strict";
var apiURL = "graph.facebook.com/v2.4/";
var request = require('request');
var databaseUtils = require('../databaseUtils');

class FacebookAnalyticsProvider {
    constructor(clientId) {
        this.name = "Facebook";
        this.clientId = clientId;
    }

    getLikes() {
        console.log(this.clientId);
        var client = databaseUtils.getClientById(this.clientId);
        request(apiURL + client.apiData.facebook.pageId + "/insights?metric=page_fans", function(error, response, body) {

            console.log(this.clientId);
            var client = databaseUtils.getClientById(this.clientId);

            if (!error && response.statusCode == 200) {

                var likes = {};
                likes.date = Date.now();
                likes.count = JSON.parse(body).data[0].values.count;
                console.log(likes.count);

                client.cachedAnalytics.likes.push(likes);
            } else {

                // from within the callback, write data to response, essentially returning it.
                client.cachedAnalytics.errorsLastCache.push("Error retrieving facebook likes." + error);

            }

            client.save();
        });
        // return 343;
    }

    // getLikes() {
    //     request('http://www.google.com', function(error, response, body) {
    //         if (error !== null)
    //             return error;

    //         if (!error && response.statusCode == 200) {
    //             // from within the callback, write data to response, essentially returning it.
    //             return 1;
    //         }
    //     });
    // }

    getFollowers(err, callback) {

    }

};

module.exports = FacebookAnalyticsProvider;