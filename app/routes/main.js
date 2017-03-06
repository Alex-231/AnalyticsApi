var express = require('express');

module.exports = function(app) {

    var apiRoutes = express.Router();

    //Should probably move this later.
    //Home route
    app.get('/', function(req, res) {
        res.send('AnalyticsApi ^_^');
    });

    apiRoutes.use('/client', require('./client')); //Client routes. (/api/client)

    app.use('/api', apiRoutes); //Route all apiRoutes to /api.
}