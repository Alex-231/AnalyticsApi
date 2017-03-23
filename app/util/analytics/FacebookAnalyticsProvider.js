"use strict";
const apiURL = "https://graph.facebook.com/v2.4/";
const providerName = "Facebook";
var request = require('request');
var databaseUtils = require('../databaseUtils');
var Client = require('../../models/Client');

class FacebookAnalyticsProvider {
    constructor(clientId) {
        this.name = "Facebook";
        this.clientId = clientId;
    }

    getLikes() {
        console.log(this.clientId);

        var self = this; //Store a reference to this, for callbacks.

        //The callback for the request below, handles the response.
        var callback = function(error, response, body) {
            Client.findById(self.clientId, function(err, client) { //Find the client to refresh.
                if (err || client === null) {
                    console.log(err); //If the client was not found, log the error. We can't store this in the database because there's no client to store it on.
                } else {
                    if (!error && response.statusCode == 200) { //If the request was successful...

                        //Find the location of the facebook provider in the database.
                        //If it's not there, make one.
                        var facebookCacheIndex = -1;

                        for (var i = 0; i < client.cachedAnalytics.length; i++) { //Loop through looking for it.
                            if (client.cachedAnalytics[i].provider == providerName) { //If it's found, store the index.
                                facebookCacheIndex = i;
                                break;
                            }
                        }

                        if (facebookCacheIndex == -1) { //If it's not found, make it.
                            if (client.cachedAnalytics === null) { //If there's no cached analytics at all, create the array and add likes.
                                client.cachedAnalytics = [{ provider: providerName, likes: [] }];
                                facebookCacheIndex = client.cachedAnalytics.length - 1;
                            } else { //Otherwise, add to the existing array.
                                client.cachedAnalytics.push({ provider: providerName, likes: [] });
                                facebookCacheIndex = client.cachedAnalytics.length - 1;
                            }
                        }

                        if (client.cachedAnalytics[facebookCacheIndex].likes === null) { //If there's no likes arryay for some reason, make one.
                            client.cachedAnalytics[facebookCacheIndex].likes = [];
                        }

                        //Push the likes data to the array.
                        client.cachedAnalytics[facebookCacheIndex].likes.push({ count: JSON.parse(body).data[0].values.length, date: Date.now() });
                    } else { //If the request was unsuccessful...
                        error = JSON.parse(body).error.message; //Try to find an error message.

                        if (error === null) //If no error message was found, make one.
                            error = "Failed to process getLikes callback.";

                        if (client.errorsLastCache === null) //If there's no errors list array, make one.
                            client.errorsLastCache = [];

                        client.errorsLastCache.push("FACEBOOK: " + error); //Add the error to the array.
                    }

                    client.save(); //Save changes to the client.
                }
            });
        };

        //Initialise request for data from facebook.
        Client.findById(self.clientId, function(err, client) { //Look for a client from the Id supplied.
            if (err) {
                console.log(err); //If an error occured, log it.
            } else if (client === null) {
                console.log("No client found, Facebook.getLikes() request, ID supplied = " + self.clientId); //If no client was found, log it.
            } else {
                //Begin the request.
                request.get(apiURL + client.apiData.facebook.pageId + "/insights?metric=page_fans&access_token=" + client.apiData.facebook.pageToken, callback);
            }
        });
    }

    getFollowers() {

    }

};

module.exports = FacebookAnalyticsProvider;