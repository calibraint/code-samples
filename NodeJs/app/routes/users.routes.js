'use strict';

const users = require('../controllers/users.controller');

module.exports = (app) => {
    app.route('/register').post(users.register);
    app.route('/login').post(users.login);
    app.route('/logout').get(users.logout);
    app.route('/user').get(users.getUser);
};
