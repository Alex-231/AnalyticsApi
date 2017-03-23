var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

var mongoConfig = require('./config/mongo');



require('./config/passport')(passport); // Require Passport Config
//Get POSTS with body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser()); // read cookies (for session)

//log requests.
app.use(morgan('dev'));

mongoose.connect(mongoConfig.database, function(err) {
    if (err) {
        console.log("Error connecting to database " + mongoConfig.database);
        console.log(err);
        process.exit(1);
    } else
        console.log("Connected to database at " + mongoConfig.database);
});

//Initialize passport.
app.use(session({
    secret: 'p1nkwalls',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Require routes.
require('./app/routes/main')(app);

//Temporary environment variables, until I find a batter place for these.
//Maybe I should handle these with docker.
process.env.NODE_IP = "localhost";
process.env.NODE_PORT = "3000";

console.log("Starting server on " + process.env.NODE_IP + ":" + process.env.NODE_PORT);
app.listen(process.env.NODE_PORT, process.env.NODE_IP);
console.log("Server listening on " + process.env.NODE_IP + ":" + process.env.NODE_PORT);