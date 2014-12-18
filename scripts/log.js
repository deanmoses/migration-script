'use strict';

var colors = require('colors');

var Log = {};
module.exports = Log;

/**
 *
 */
Log.info = function(string) {
    if (arguments.length > 0) {
        arguments[0] = arguments[0].gray.dim;
        console.log.apply(null, arguments);
    }
};

/**
 *
 */
Log.warn = function() {
    if (arguments.length > 0) {
        arguments[0] = 'WARNING: '.red.bold + ' ' + arguments[0];
        console.log.apply(null, arguments);
    }
};