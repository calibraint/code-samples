'use strict';

function InvalidEmailOrPassword() {
    this.getMessage = function() {
        return "Invalid Email or Password";
    };
    this.getStatusCode = function() {
        return 401;
    };
}

require("util").inherits(InvalidEmailOrPassword, Error);

module.exports = InvalidEmailOrPassword;
