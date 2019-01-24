'use strict';

// NPM modules
var mongoose = require('mongoose'),
    chalk = require('chalk'),

    // custom modules
    config = require('../index');

mongoose.Promise = require('bluebird');

// connect to database
module.exports.connect = function(dbConfig, callback) {
    var connectionUrl = 'mongodb://' + dbConfig.host + '/' + dbConfig.name,
        options = {
            user: dbConfig.username,
            pass: dbConfig.password,
            useNewUrlParser: true,
        },
        db;

    db = mongoose.connect(connectionUrl, options, function(error) {
        if (error) {
            console.error(error);
        } else {
            callback(db);
        }
    });

    mongoose.connection.on('connected', function() {
        console.info('%s: MongoDB connected', new Date());
    });

    // If the connection throws an error
    mongoose.connection.on('error', function(err) {
        console.error('MongoDB default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function() {
        console.info('%s: MongoDB default connection disconnected... ', new Date());
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.info('%s: MongoDB default connection disconnected through app termination SIGINT... ', new Date());
            process.exit(0);
        });
    });
};
