'use strict';

/**
 * Configurations for All Environments
 */
module.exports = {
    urlPrefix: '/api',
    emailPattern: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
    phonePattern: /^([()\- x+]*\d[()\- x+]*){4,16}$/,
};
