var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    }
});

AdminSchema.pre('validate', function(next) {

    if (!this.created) {
        this.created = Date.now();
    }

    return next();
});

//Hash password.
AdminSchema.pre('save', function(next) {
    var admin = this;

    //If there's a password...
    if (this.password) {
        if (this.isModified('password') || this.isNew) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    return next(err);
                }
                bcrypt.hash(admin.password, salt, null, function(err, hash) {
                    if (err) {
                        return next(err);
                    }
                    admin.password = hash;
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
AdminSchema.methods.comparePassword = function(pw, cb) {
    bcrypt.compare(pw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Admin', AdminSchema);