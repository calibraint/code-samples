'use strict';

function UserExistError() {
    this.getMessage = function() {
        return "User already exist";
    };
    this.getStatusCode = function() {
        return 409;
    };
}

require("util").inherits(UserExistError, Error);

module.exports = UserExistError;
