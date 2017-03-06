var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ClientUserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    access: {
        type: String,
        enum: ['Write', 'Read', 'None'],
        default: 'Read'
    },
    signedUp: {
        type: Date,
        required: true
    }
});

ClientUserSchema.pre('validate', function(next) {

    //If there's no profile create date, add one now.
    if (!this.created) {
        this.created = Date.now();
    }

    return next();
});

//Hash password.
ClientUserSchema.pre('save', function(next) {
    var user = this;

    //If there's a password...
    if (this.password) {
        if (this.isModified('password') || this.isNew) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    return next(err);
                }
                bcrypt.hash(user.password, salt, null, function(err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    next();
                });
            });
        } else {
            return next();
        }
    } else {
        return next();
    }
});

//Compare password.
ClientUserSchema.methods.comparePassword = function(pw, cb) {
    bcrypt.compare(pw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('ClientUser', ClientUserSchema);