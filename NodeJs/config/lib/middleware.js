'use strict';

const winston = require('winston'),
    util = require('util'),
    colors = require('colors'),
    errors = require ('../../app/errors/errors');

const restResponse = (req, res, next) => {
    res.success = (res, data) => {
        res.status(200).json({
            status: 'success',
            data: data || null,
        })
    };

    res.fail = (res, error) => {
        res.status(400).json({
            status: 'fail',
            message: message || null,
        });
    };

    res.message = (res, code, message) => {
        res.status(code).json({
            status: 'fail',
            message: message || null,
        });
    };

    res.authenticationError = (res, code, data) => {
        res.status(code).json({
            status: 'fail',
            message: data || null,
        });
    }

    res.error = (res, code, message, data) => {
        res.status(code).json({
            status: 'error',
            code: code || 500,
            message: message || null,
            data: data || null,
        });
    };

    res.errorMessage = (res, err) => {
        const code = typeof err.getStatusCode === "function" ? err.getStatusCode() : 500;
        const message = typeof err.getMessage === "function" ? err.getMessage() : err.message || err.stack || err;
        res.status(code).json({
            status: 'fail',
            message: message || null,
        });
    };

    res.successMessage = (res, message) => {
        res.status(200).json({
            status: 'success',
            message: message || null,
        });
    };

    next();
}

const setUpWinston = function() {
    winston.level = 'verbose';

    // Log the Error message too as otherwise Winston only logs the stack trace.
    var oldError = winston.log;
    winston.log = function() {
        var newArgs = [];
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg && arg.stack) {
                newArgs.push(util.inspect(arg));
            }
            newArgs.push(arg);
        }
        oldError.apply(oldError, newArgs);
    };

    winston.loggers.add('rest', {
        transports: [ new (winston.transports.Console)({ level: 'verbose' }) ],
    });
}

module.exports = (app) => {
    setUpWinston();

    app.use(restResponse);

    app.use((req, res, next) => {
        let url = req.url;
        let params;

        if (req.method == 'GET') {
            if (url.indexOf('?') >= 0) {
                url = url.substring(0, url.indexOf('?'));
            }
            params = toSecureParams(req.query);
        }
        else {
            params = toSecureParams(req.body);
        }

        // log request method, url and params, colorizing each
        winston.verbose(
            colors.cyan(req.method),
            colors.green(url),
            (Object.keys(params).length > 0 ? '\n' + colors.grey(util.inspect(params)) : '')
        );
        next();
    });

    const toSecureParams = (obj) => {
        let params = {};

        for (const param in obj) {
            params[param] = obj[param];
            if (/password/i.test(param)) {
                params[param] = '*****';
            }
        }

        return params;
    };
};
