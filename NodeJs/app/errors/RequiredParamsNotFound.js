'use strict';

function RequiredParamasNotFound() {
    this.getMessage = function() {
        return "Your Account has been deactivated";
    };
    this.getStatusCode = function() {
        return 401;
    };
}

require("util").inherits(RequiredParamasNotFound, Error);

module.exports = RequiredParamasNotFound;
