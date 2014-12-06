/**
 * Created by moses on 12/6/14.
 */
'use strict';

var fs = require('fs');
var Config = require('./config.js');
var Photo = require('./photo.js');

/**
 * Create a new Album object over a JSON data file on disk.
 *
 * @param year like 2001
 * @param month like 12
 * @param day like 31
 */
function Album(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.albumPath = Config.jsonDirBase + '/' + year + '/' + month + '-' + day + '/album.json';

    // retrieve data from filesystem, if available
    try {
        this.data = JSON.parse(fs.readFileSync(this.albumPath, 'utf8'));
    } catch(e) {
        // if it's a file not found error
        if (e.code === 'ENOENT') {
            console.log('album has no JSON: %s/%s-%s', year, month, day);
        }
        // else I don't know what the error is, rethrow it
        else {
            throw e;
        }
    }
}

/**
 * True if there was an entry in the JSON file for this photo
 */
Album.prototype.hasData = function() {
    return !!this.data;
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
        // get rid of extension if one was passed in
        var photoName = filename;
        if (photoName.indexOf('.')) {
            photoName = photoName.split('.');
            photoName.pop();
            photoName = photoName.join('.');
        }
        photoData = this.data.children[photoName];
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
        if (!description) {
            debugger;
        }
    } catch(e) {
        // if it's a file not found error
        if (e.code === 'ENOENT') {
            //console.log('photo has no file-based description: %s/%s-%s/%s', this.year, this.month, this.day, filename);
        }
    }
    return description;
};


module.exports = Album;