'use strict';

/**
 * App configurations
 */

// custom modules
var config = require('.././'),
    db = require('./db'),
    express = require('./express');

// app initialization
module.exports.init = function(dbConfig, callback) {
    var app;
    db.connect(dbConfig, function(dbConnection) {
        app = express.init(dbConnection);
        callback(app, dbConnection);
    });
};

// bootstarp the app
module.exports.start = function(dbConfig) {
    var self = this;

    self.init(dbConfig, function(app, dbConnection) {
        app.listen(process.env.NODE_PORT, function() {
            console.info('%s: Rest App Started with %s environment... ', new Date(), process.env.NODE_ENV);
            console.log('%s: Server running at http://localhost:%d', new Date(), process.env.NODE_PORT);
        });
    });
};
