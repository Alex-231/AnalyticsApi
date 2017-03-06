var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/register', /*passport.authenticate(),*/ function(req, res) {

    res.send({ success: true, message: 'Register client route.' });
});

module.exports = router;