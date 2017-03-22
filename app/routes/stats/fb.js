var express = require('express');
var router = express.Router();
var passport = require('passport');
var Client = require('../models/Client');

router.use('/fb', require('./fb'));