'use strict';

function InvalidEmail() {
    this.getMessage = function() {
        return "Invalid Password";
    };
    this.getStatusCode = function() {
        return 400;
    };
}

require("util").inherits(InvalidEmail, Error);

module.exports = InvalidEmail;
