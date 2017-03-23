var Client = require('../models/Client');

function getClientById(id) { //This method isn't working. Needs fixing for future refactoring.
    console.log("looking for client with id " + id);
    Client.findById(id, function(err, client) {
        if (err) {
            console.log(err);
            console.log(id);
        }

        console.log(client);
        return client;
    });
}

module.exports.getClientById = getClientById;