'use strict';

function InvalidPhoneNumber() {
    this.getMessage = function() {
        return "Invalid Phone Number";
    };
    this.getStatusCode = function() {
        return 400;
    };
}

require("util").inherits(InvalidPhoneNumber, Error);

module.exports = InvalidPhoneNumber;
