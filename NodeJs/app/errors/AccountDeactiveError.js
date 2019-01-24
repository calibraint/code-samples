'use strict';

function AccountDeactiveError() {
    this.getMessage = function() {
        return "Your Account has been deactivated";
    };
    this.getStatusCode = function() {
        return 401;
    };
}

require("util").inherits(AccountDeactiveError, Error);

module.exports = AccountDeactiveError;
