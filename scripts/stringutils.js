/**
 * Created by moses on 12/6/14.
 */
'use strict';

var StringUtils = {};

StringUtils.startsWith = function(str, prefix){
    return str.lastIndexOf(prefix, 0) === 0
};

StringUtils.endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

StringUtils.endsWithIgnoreCase = function(str, suffix) {
    return str.toLowerCase().indexOf(suffix.toLowerCase(), str.length - suffix.length) !== -1;
};

module.exports = StringUtils;