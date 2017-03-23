// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't, respond appropriately.

    var responseObject = {};
    responseObject.message = "Not authenticated.";
    responseObject.success = false;
    res.send(responseObject);
}

module.exports.isLoggedIn = isLoggedIn;