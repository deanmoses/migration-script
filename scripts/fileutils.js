/**
 * Created by moses on 12/6/14.
 */
'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var StringUtils = require('./stringutils.js');

var FileUtils = {};

FileUtils.isBadFile = function(file) {
    if (StringUtils.startsWith(file, '.')) {
        return true;
    }
    // ignore the photo.txt descriptions:  we'll be getting them from the JSON
    else if (StringUtils.endsWithIgnoreCase(file, '.txt')) {
        return true;
    }
    else if (StringUtils.endsWithIgnoreCase(file, '.doc')) {
        return true;
    }
    else if (file === 'Thumbs.db') {
        return true;
    }
    else if (file == 'Picasa.ini') {
        return true;
    }
    else if (file === 'comments.properties') {
        return true;
    }
    else if (file === 'header.inc') {
        return true;
    }
    return false;
};

FileUtils.validMonths = ['01','02','03','04','05','06','07','08','09','10','11','12'];
FileUtils.validDays = ['01','02','03','04','05','06','07','08','09','10',
    '11','12','13','14','15','16','17','18','19','20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

/**
 * Return true if dirName is 01 through 12.  Nothing else.
 */
FileUtils.isValidMonth = function(dirName) {
    return FileUtils.validMonths.indexOf(dirName) >= 0;
};

/**
 * Return true if dirName is 01 through 31.  Nothing else.
 */
FileUtils.isValidDay = function(dirName) {
    return FileUtils.validDays.indexOf(dirName) >= 0;
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

/**
 * Copy a file from source location to target.
 */
FileUtils.copyFile = function(source, targetDir, targetFilename) {
    var target = targetDir + '/' + targetFilename;
    if (fs.existsSync(target)) {
        return;
    }
    mkdirp.sync(targetDir);
    fs.writeFileSync(target, fs.readFileSync(source));
    console.log('\tcopied %s', target);
};

/**
 * Create file with specified contents.
 */
FileUtils.writeFile = function(dir, filename, contents) {
    var path = dir + '/' + filename;
    if (!fs.existsSync(path)) {
        mkdirp.sync(dir);
        fs.writeFileSync(path, contents);
        console.log('\twrote %s', path);
    }
};

module.exports = FileUtils;