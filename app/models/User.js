var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.ObjectId;

var UserSchema = new mongoose.Schema({
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
    role: {
        type: String,
        require: true,
        enum: ['Admin', 'ClientUser', 'None'],
        default: 'None'
    },
    clients: {
        type: [ObjectId],
        required: false,
    },
    created: {
        type: Date,
        required: true
    }
});

UserSchema.pre('validate', function(next) {

    if (!this.created) {
        this.created = Date.now();
    }

    return next();
});

//Hash password.
UserSchema.pre('save', function(next) {
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
UserSchema.methods.comparePassword = function(pw, cb) {
    bcrypt.compare(pw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);