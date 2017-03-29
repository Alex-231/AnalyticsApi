var express = require('express');

module.exports = function(app) {

    var apiRoutes = express.Router();

    require('../util/routerUtils');

    //Should probably move this later.
    //Home route
    app.get('/', function(req, res) {
        var responseObject = {};
        responseObject.message = "AnalyticsApi ^_^";
        responseObject.success = true;
        res.send(responseObject);
    });

    apiRoutes.use('/client', require('./client')); //Client routes. (/api/client)

    apiRoutes.use('/client/:clientId/', require('./stats/stats')); //Stats routes (/(clientId)/stats)

    apiRoutes.use('/auth', require('./auth')); //Client routes. (/api/client)

    app.use('/api', apiRoutes); //Route all apiRoutes to /api.
};