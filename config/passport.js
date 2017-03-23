var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {

    //Serialize user for session token.
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    //Deserialize user for session token.
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //Local signup stratergy.
    passport.use('local-signup', new LocalStrategy({
            //Override default local strat
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) {

            //Look for an existing user.
            User.findOne({ email: email.toLowerCase() }, function(err, user) {
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

    //Local login strat.
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) { // callback with email and password from our form

            //Look for an existing user.
            User.findOne({ email: email.toLowerCase() }, function(err, user) {

                if (err) {
                    return done(err, false);
                }

                // if no user is found, return the message
                if (!user) {
                    return done("No user found", false);
                }

                //Use the schema password compare function.
                user.comparePassword(password, function(err, isMatch) {
                    if (isMatch && !err) {
                        return done(null, user);
                    } else {
                        return done("Authentication Error", false);
                    }
                })

                // got eem.
                return done(null, user);
            });
        }));
};