module.exports = function(app) {

    //Should probably move this later.
    //Home route
    app.get('/', function(req, res) {
        res.send('Homepage route.')
    })

}