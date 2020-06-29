module.exports = {
    init: function() {
        "use strict";
        const express = require('express');
        const app = express();
        app.get('/', function(req, res) {
            res.send("Welcome to CLI-Assistant!");
        });
        const server = app.listen(3003, function () {
            console.log('Express server listening on port ' + server.address().port);
        });
    }
}
