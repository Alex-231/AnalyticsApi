"use strict";
const apiURL = "https://ads-api.twitter.com/1.1/";
const providerName = "Twitter";
var request = require('request');
var databaseUtils = require('../databaseUtils');
var Client = require('../../models/Client');

class FacebookAnalyticsProvider {
    constructor(clientId) {
        this.name = "Twitter";
        this.clientId = clientId;
    }

    getPostLikes() {
        var self = this; //Store a reference to this, for callbacks.

        //The callback for the request below, handles the response.
        var postsCallback = function(error, response, body) {
            Client.findById(self.clientId, function(err, client) { //Find the client to refresh.
                if (err || client === null) {
                    console.log(err); //If the client was not found, log the error. We can't store this in the database because there's no client to store it on.
                } else {
                    if (!error && response.statusCode == 200) { //If the request was successful...

                        //Find the location of the facebook provider in the database.
                        //If it's not there, make one.
                        var twitterCacheIndex = -1;

                        for (var i = 0; i < client.cachedAnalytics.length; i++) { //Loop through looking for the cache.
                            if (client.cachedAnalytics[i].provider == providerName) { //If it's found, store the index.
                                twitterCacheIndex = i;
                                break;
                            }
                        }

                        if (twitterCacheIndex == -1) { //If it's not found, make it.
                            if (client.cachedAnalytics === null) { //If there's no cached analytics at all, create the array and add likes.
                                client.cachedAnalytics = [{ provider: providerName, posts: [] }];
                                twitterCacheIndex = client.cachedAnalytics.length - 1;
                            } else { //Otherwise, add to the existing array.
                                client.cachedAnalytics.push({ provider: providerName, posts: [] });
                                twitterCacheIndex = client.cachedAnalytics.length - 1;
                            }
                        }

                        //Now store the post IDs.

                        client.cachedAnalytics[twitterCacheIndex].posts = [];

                        client.save(); //Save changes to the client.
                        //Now request the likes.

                        for (var i = 0; i < JSON.parse(body).length; i++) {
                            client.cachedAnalytics[twitterCacheIndex].push({
                                likes: JSON.parse(body)[i].favourites_count,
                                id: JSON.parse(body)[i].id
                            });
                        }

                    } else { //If the request was unsuccessful...
                        error = JSON.parse(body).errors[0].message; //Try to find an error message.

                        if (error === null) //If no error message was found, make one.
                            error = "Failed to process getPostLikes posts callback.";

                        if (client.errorsLastCache === null) //If there's no errors list array, make one.
                            client.errorsLastCache = [];

                        client.errorsLastCache.push(providerName + " " + error); //Add the error to the array.

                        client.save(); //Save changes to the client.
                    }
                }
            });
        };

        //Initialise request for data from facebook.
        Client.findById(self.clientId, function(err, client) { //Look for a client from the Id supplied.
            if (err) {
                console.log(err); //If an error occured, log it.
            } else if (client === null) {
                console.log("No client found, Facebook.getPostLikes() request, ID supplied = " + self.clientId); //If no client was found, log it.
            } else {
                //Begin the request.
                request.get(apiURL + "statuses/user_timeline.json", postsCallback);
            }
        });
    }

    getLikes() {}

    getFollowers() {

    }

    getViews() {}

};

module.exports = FacebookAnalyticsProvider;