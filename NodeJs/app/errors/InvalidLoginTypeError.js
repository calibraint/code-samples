'use strict';

function InvalidLoginTypeError() {
    this.getMessage = function() {
        return "Invalid Login Type";
    };
    this.getStatusCode = function() {
        return 404;
    };
}

require("util").inherits(InvalidLoginTypeError, Error);

module.exports = InvalidLoginTypeError;
