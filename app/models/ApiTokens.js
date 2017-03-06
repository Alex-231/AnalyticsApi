var mongoose = require('mongoose');

var ApiTokensSchema = new mongoose.Schema({
    facebookToken: {
        type: String,
    },
    twitterToken: {
        type: String,
    },
    instagramToken: {
        type: String,
    },
    googleToken: {
        type: String,
    },
});

module.exports = mongoose.model('ApiTokens', ApiTokensSchema);