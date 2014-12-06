/**
 * Created by moses on 12/6/14.
 */
var fs = require('fs');

var FileUtils = {};

FileUtils.startsWith = function(str, prefix){
    return str.lastIndexOf(prefix, 0) === 0
};

FileUtils.endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

FileUtils.isBadFile = function(file) {
    if (FileUtils.startsWith(file, '.')) {
        return true;
    }
    else if (FileUtils.endsWith(file, '.txt')) {
        return true;
    }
    else if (file === 'Thumbs.db') {
        return true;
    }
    return false;
};

FileUtils.getUnsortedSubDirs = function(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return (fs.statSync(srcpath + '/' + file).isDirectory())
            && !FileUtils.isBadFile(file);
    });
};

FileUtils.getSubDirs = function(srcpath) {
    return FileUtils.getUnsortedSubDirs(srcpath).sort(function(a, b) {
        return a.localeCompare(b);
    });
};

FileUtils.getUnsortedFiles = function getUnsortedFiles(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return (fs.statSync(srcpath + '/' + file).isFile())
            && !FileUtils.isBadFile(file);
    });
};

FileUtils.getFiles = function getFiles(srcpath) {
    return FileUtils.getUnsortedFiles(srcpath).sort(function(a, b) {
        return a.localeCompare(b);
    });
};

module.exports = FileUtils;