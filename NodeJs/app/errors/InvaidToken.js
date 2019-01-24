'use strict';

function InvalidToken() {
    this.getMessage = function() {
        return "Invalid Token";
    };
    this.getStatusCode = function() {
        return 401;
    };
}

require("util").inherits(InvalidToken, Error);

module.exports = InvalidToken;
