// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            //Override default local strat
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) {

            console.log("email " + email);

            console.log("About to look for an existing user...");

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exist.

            User.findOne({ email: email.toLowerCase() }, function(err, user) {
                // if there are any errors, return the error
                console.log("findOne returned " + err + " " + user);

                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done("Email already registered", false);
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.email = email;
                    newUser.password = password;

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });
        }));

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ email: email.toLowerCase() }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done("No user found", false);

                user.comparePassword(password, function(err, isMatch) {
                    if (isMatch && !err) {
                        return done(null, user);
                    } else {
                        return done("Authentication Error", null);
                    }
                })

                // all is well, return successful user
                return done(null, user);
            });
        }));
};