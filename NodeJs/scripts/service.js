'use strict';

const hat = require('hat');
const rack = hat.rack();

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Please provide service name');
    process.exit(0);
}

const obj = Object.freeze({
    id: require('cuid')(),
    serviceName: args[0],
    liveApiKey: rack(),
    testApiKey: rack(),
    isActive: true,
});

console.log(JSON.stringify(obj));
process.exit();
