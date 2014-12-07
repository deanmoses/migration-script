'use strict';

var Config = require('./config.js');
var FileUtils = require('./fileutils.js');
var Album = require('./album.js');
var Xmp = require('./xmp.js');

var Walk = {};

Walk.numProcessed = 0;
Walk.maxToProcess = 200;

/**
 * Find each album and photo in the year and pass it to the callback functions.
 */
Walk.year = function(year, write) {
    // for each month
    FileUtils.getSubDirs(Config.yearDirBase + '/' + year).forEach(function(month) {
        Walk.month(year, month, write);
    });
};

/**
 * Walk a month's worth of albums and call back the creation functions.
 */
Walk.month = function(year, month, write) {
    if (!FileUtils.isValidMonth(month)) {
        throw 'weird month: ' + year + '/' + month;
    }

    // for each week
    FileUtils.getSubDirs(Config.yearDirBase + '/' + year + '/' + month).forEach(function(day) {
        Walk.day(year, month, day, write);
    });
};

/**
 * Walk an individual album and call back the creation functions
 */
Walk.day = function(year, month, day, write) {
    var album = new Album(year, month, day);
    Walk.processAlbum(album, write);

    // for each photo in week
    FileUtils.getFiles(Config.yearDirBase + '/' + year + '/' + month + '/' + day).forEach(function(photoName) {
        Walk.processPhoto(album.getPhoto(photoName), write);
    });
};

/**
 * Process a single album
 * @param album Album object
 * @param write
 */
Walk.processAlbum = function(album, write) {
    if (!album) {
        throw 'null album';
    }

    console.log('processing: %s/%s/%s', album.year, album.month, album.day);

    var xmp = Xmp.albumXmp(album.title(), album.description(), album.summary(), album.exifDate());
    if (write) {
        FileUtils.writeFile(album.targetYearDir(), album.xmpFilename(), xmp);
    }
    else {
        console.log('Would have written album: %s/%s-%s', album.year, album.month, album.day);
    }
};

/**
 * Process a single photo
 * @param photo Photo object
 */
Walk.processPhoto = function(photo, write) {
    if (!photo) {
        throw 'null photo';
    }

    if (!photo.isKnownImageType()) {
        console.log('skip (unhandled extension): %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.filename);
    }
    else if (photo.noJsonData()) {
        console.log('skip (no json): %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.targetFilename());
    }
    // It's a jpg or bmp, with JSON data
    // It's valid to be transferred
    else {
        console.log('processing: %s/%s/%s/%s', photo.year, photo.month, photo.day, photo.filename);

        var xmp = Xmp.imageXmp(photo.title(), photo.description(), photo.exifDate());
        if (write) {
            FileUtils.writeFile(photo.targetDir(), photo.xmpFilename(), xmp);

            // copy the actual image over
            FileUtils.copyFile(photo.sourceFile(), photo.targetDir(), photo.targetFilename());
        }
        else {
            console.log('Would have written photo: %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.targetFilename());
        }
    }

    Walk.numProcessed = Walk.numProcessed + 1;
    if (Walk.numProcessed >= Walk.maxToProcess) {
        process.exit();
    }
};

module.exports = Walk;