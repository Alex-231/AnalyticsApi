var mongoose = require('mongoose');

//Require embedded document schemas.
var ClientUserSchema = require('./ClientUser');
var ApiTokensSchema = require('./ApiTokens');

var ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    emails: {
        type: [String],
        required: true
    },
    apiTokens: {
        type: ApiTokensSchema.schema,
        required: true
    }
});

module.exports = mongoose.model('Client', ClientSchema);