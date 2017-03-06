var express = require('express');
var app = express(); //Instance express (?)
var mongoose = require('mongoose'); //Mongo Connection
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var mongoConfig = require('./config/mongo');

//Get POSTS with body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//log requests.
app.use(morgan('dev'));

//Initialize passport.
app.use(passport.initialize());

//Connect to db
mongoose.connect(mongoConfig.database);

//Require routes.
require('./app/routes/main')(app);

//Temporary environment variables, until I find a batter place for these.
//Maybe I should handle these with docker.
process.env.NODE_IP = "localhost";
process.env.NODE_PORT = "3000";

console.log("Starting server on " + process.env.NODE_IP + ":" + process.env.NODE_PORT);
app.listen(process.env.NODE_PORT, process.env.NODE_IP);
console.log("Server listening on " + process.env.NODE_IP + ":" + process.env.NODE_PORT);