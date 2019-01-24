'use strict';

function InvalidActivationTypeError() {
    this.getMessage = function() {
        return "Invalid Activation Type";
    };
    this.getStatusCode = function() {
        return 404;
    };
}

require("util").inherits(InvalidActivationTypeError, Error);

module.exports = InvalidActivationTypeError;
