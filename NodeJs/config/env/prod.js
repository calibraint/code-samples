'use strict';

module.exports = {
    app: {
        publicResources: [
            '/',
            '/auth/signin',
            '/auth/user',
        ],
    },
    environment: 'dev',
    port: 7000,
    db: {
        host: 'localhost:27017',
        name: 'rest',
        username: '',
        password: '',
        connectionTimeout: 3000,
    },
    mail: {
        host: '',
        port: 587,
        user: "",
        pass: "",
    },
    JWTSecretKey: 'b39382016ffb4f06a135dcf77f7bbfa6',
};
