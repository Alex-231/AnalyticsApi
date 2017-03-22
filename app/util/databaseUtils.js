var Client = require('../models/Client');

function getClientById(id) {
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