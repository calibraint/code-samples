'use strict';

function InvalidEmail() {
    this.getMessage = function() {
        return "Invalid Email";
    };
    this.getStatusCode = function() {
        return 401;
    };
}

require("util").inherits(InvalidEmail, Error);

module.exports = InvalidEmail;
