var mongoose = require('mongoose');

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
    apiData: {
        facebook: {
            appId: {
                type: String
            },
            appSecret: {
                type: String
            },
            pageToken: {
                type: String
            },
            pageId: {
                type: String
            }
        },
        twitter: {

        },
        instagram: {
            userToken: {
                type: String
            }
        }
    },
    cachedAnalytics: [{
        provider: {
            type: String,
            required: true
        },
        likes: [{
            count: {
                type: Number
            },
            date: {
                type: Date
            }
        }],
        views: [{
            count: {
                type: Number
            },
            date: {
                type: Date
            }
        }],
        posts: [{
            id: {
                type: String,
                required: true
            },
            likes: [{
                count: {
                    type: Number
                },
                date: {
                    type: Date
                }
            }]
        }],
        followers: [{
            count: {
                type: Number
            },
            date: {
                type: Date
            }
        }],
    }],
    errorsLastCache: {
        type: [String]
    }
});

module.exports = mongoose.model('Client', ClientSchema);