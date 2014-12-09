/**
 * Created by moses on 12/6/14.
 */
'use strict';

var fs = require('fs');
var _ = require('underscore');
var Config = require('./config.js');
var Photo = require('./photo.js');
var StringUtils = require('./stringutils.js');

/**
 * Create a new Album object over a JSON data file on disk.
 *
 * @param year like 2001
 * @param month like 12
 * @param day like 31
 */
function Album(year, month, day, data) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.data = data;
	this.isDynamic = year > 2006;
}

Album.prototype.exifDate = function() {
    return this.year + '-' + this.month + '-' + this.day;
};

/**
 * True if there was an entry in the JSON file for this photo
 */
Album.prototype.hasData = function() {
    return !!this.data;
};

Album.prototype.title = function() {
    return this.get('title');
};

Album.prototype.description = function() {
    return this.get('description');
};

Album.prototype.summary = function() {
    return this.get('summary');
};

Album.prototype.xmpFilename = function() {
    return this.targetDirName() + '.xmp';
};

Album.prototype.xmpFile = function() {
    return this.targetYearDir() + '/' + this.xmpFilename();
};

Album.prototype.targetDir = function() {
    return this.targetYearDir() + '/' + this.targetDirName();
};

Album.prototype.targetDirName = function() {
    return this.month + '-' + this.day;
};

Album.prototype.targetYearDir = function() {
    return Config.targetDirBase + '/' + this.year;
};

/**
 * Get Photo object about a particular photo.
 *
 * @param filename like 'felix.jpg'
 */
Album.prototype.getPhoto = function(filename) {

    // attempt to retrieve info about the photo from the JSON album
    var jsonData = this.getPhotoJsonData(filename);

    // attempt to retrieve description from photoName.txt (though JSON should have the live description)
    var fileDescription = this.getPhotoFileDescription(filename);

    return new Photo(this.year, this.month, this.day, filename, jsonData, fileDescription);
};

/**
 * Get the data about a particular photo.
 *
 * Null if no such photo.
 *
 * @param filename like 'felix.jpg'
 */
Album.prototype.getPhotoJsonData = function(filename) {

    // attempt to retrieve info about the photo from the JSON album
    var photoData;
    if (this.data) {

        // 2007-2014
        if (this.isDynamic) {
            photoData = _.find(this.data.children, function(obj) { return obj.pathComponent == filename })
        }
        // 2001-2006
        else {
            var photoName = StringUtils.stripExtension(filename);
            photoData = this.data.children[photoName];
        }
    }

    return photoData;
};

/**
 * Get the file-based description for a particular photo.
 * (though JSON should have the actual, current live description)
 *
 * Null if no description.
 *
 * @param filename like 'felix.jpg'
 */
Album.prototype.getPhotoFileDescription = function(filename) {

    var photoDescriptionFilename = filename.replace('jpg', 'txt');
    var photoDescriptionFilePath = Config.yearDirBase + '/' + this.year + '/' + this.month + '/' + this.day  + '/' +  photoDescriptionFilename;

    // retrieve text file from filesystem, if available
    var description;
    try {
        description = fs.readFileSync(photoDescriptionFilePath, {encoding: 'utf8'});
    } catch(e) {
        // if it's a file not found error
        if (e.code === 'ENOENT') {
            //console.log('photo has no file-based description: %s/%s-%s/%s', this.year, this.month, this.day, filename);
        }
    }
    return description;
};

/**
 * Get a property from the JSON data object
 */
Album.prototype.get = function(propertyName) {
    return (!!this.data) ? this.data[propertyName] : null;
};

module.exports = Album;