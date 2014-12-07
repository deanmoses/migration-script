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

StringUtils.stripExtension = function(filename) {
    var noExt = filename;
    if (noExt.indexOf('.')) {
        noExt = noExt.split('.');
        noExt.pop();
        noExt = noExt.join('.');
    }
    return noExt;
};

StringUtils.encodeHtml = function(regularHtml) {
    return regularHtml.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

module.exports = StringUtils;