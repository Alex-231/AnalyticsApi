//Template for analytics.

"use strict";
const apiURL = "If you're trying to request template provider statistics you're doing it wrong.";
const providerName = "TemplateProvider I shouldnt be instanced";
var request = require('request');
var databaseUtils = require('../databaseUtils');
var Client = require('../../models/Client');

class FacebookAnalyticsProvider {
    constructor(clientId) {
        this.name = "TemplateProvider I shouldnt be instanced";
        this.clientId = clientId;
    }

    //These are methods provider classes need.
    //They don't need a body, but they need a signature.

    getPostLikes() {

    }

    getLikes() {

    }

    getFollowers() {

    }

    getViews() {

    }
}