/**
 * Created by moses on 12/6/14.
 */

'use strict';

var Config = require('./config.js');
var StringUtils = require('./stringutils.js');
var moment = require('moment');
var fs = require('fs');

/**
 * Create a new Photo object over a pack of passed-in data
 *
 * @param data from filesystem (retrieved by Album object)
 */
function Photo(year, month, day, filename, data, textDescription) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.filename = filename;
    //this.timestamp = Math.round(new Date(year, month, day).getTime() / 1000);
    this.data = data;
    this.textDescription = textDescription;
}

Photo.prototype.title = function() {
    return this.get('title');
};

Photo.prototype.description = function() {
    return this.get('description');
};

/**
 * For use in <exif:DateTimeOriginal>2001-11-23</exif:DateTimeOriginal>
 */
Photo.prototype.exifDate = function() {
    return moment(this.date()).format('YYYY-MM-DD');
    //return this.year + '-' + this.month + '-' + this.day;
};

Photo.prototype.isKnownImageType = function() {
    return this.isJpg() || this.isBmp();
};

Photo.prototype.isJpg = function() {
    return StringUtils.endsWith(this.targetFilename(), '.jpg');
};

Photo.prototype.isBmp = function() {
    return StringUtils.endsWith(this.targetFilename(), '.bmp');
};

Photo.prototype.targetFilename = function() {
    if (StringUtils.endsWithIgnoreCase(this.filename, '.jpeg')) {
        return this.filename.toLowerCase().replace('.jpeg', '.jpg');
    }
    return this.filename.toLowerCase();
};

Photo.prototype.fileNoExt = function() {
    return StringUtils.stripExtension(this.filename);
};

Photo.prototype.xmpFilename = function() {
    return this.fileNoExt() + '.xmp';
};

Photo.prototype.xmpFile = function() {
    return this.targetDir()  + '/' +  this.xmpFilename();
};

Photo.prototype.targetFile = function() {
    return this.targetDir()  + '/' +  this.targetFilename();
};

Photo.prototype.sourceFile = function() {
    return this.sourceDir()  + '/' +  this.filename;
};

Photo.prototype.targetDir = function() {
    return Config.targetDirBase + '/' + this.year + '/' + this.month + '-' + this.day;
};

Photo.prototype.sourceDir = function() {
    return Config.yearDirBase  + '/' + this.year + '/' + this.month + '/' + this.day;
};

Photo.prototype.date = function() {
    return fs.statSync(this.sourceFile()).ctime;
}

/**
 * True if there is no .txt file with this photo's description
 */
Photo.prototype.noTextDescription = function() {
    return this.textDescription === undefined || this.textDescription === null;
};

/**
 * True if there is no entry in the JSON file for this photo
 */
Photo.prototype.noJsonData = function() {
    return !this.data;
};

/**
 * Get a property from the JSON data object
 */
Photo.prototype.get = function(propertyName) {
    return (!!this.data) ? this.data[propertyName] : null;
};

module.exports = Photo;