var express = require('express');

module.exports = function(app) {

    var apiRoutes = express.Router();

    require('../util/routerUtils');

    //Should probably move this later.
    //Home route, for debugging purposes.
    app.get('/', function(req, res) {
        var responseObject = {};
        responseObject.message = "AnalyticsApi <3";
        responseObject.success = true;
        res.send(responseObject);
    });

    //Client routes. (/api/client)
    apiRoutes.use('/client', require('./client'));

    //Stats routes (/<clientId>/stats)
    apiRoutes.use('/client/:clientId/', require('./stats'));

    //Client routes. (/api/client)
    apiRoutes.use('/auth', require('./auth'));



    //Route all apiRoutes to /api.
    app.use('/api', apiRoutes);
};