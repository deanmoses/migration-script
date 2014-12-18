'use strict';

var Config = require('./config.js');
var FileUtils = require('./fileutils.js');
var StringUtils = require('./stringutils.js');
var AlbumStore = require('./albumstore.js');
var Xmp = require('./xmp.js');
var Log = require('./log.js');
var colors = require('colors');

var Walk = {};

Walk.numProcessed = 0;
Walk.reachedMax = false;

/**
 * Find each album and photo in the year and pass it to the callback functions.
 */
Walk.year = function(year, options) {
    if (!year) throw 'no year';
    if (!options) throw 'no options';
    if (Walk.reachedMax) return;

    // for each month
    FileUtils.getSubDirs(Config.yearDirBase + '/' + year).forEach(function(month) {
        Walk.month(year, month, options);
    });
};

/**
 * Walk a month's worth of albums and call back the creation functions.
 */
Walk.month = function(year, month, options) {
    if (!year) throw 'no year';
    if (!month) throw 'no month';
    if (!options) throw 'no options';
    if (Walk.reachedMax) return;

    if (!FileUtils.isValidMonth(month)) {
        Log.warn('skip weird month: ' + year + '/' + month);
    }
    else {
        // for each week
        FileUtils.getSubDirs(Config.yearDirBase + '/' + year + '/' + month).forEach(function (day) {
            Walk.day(year, month, day, options);
        });
    }
};

/**
 * Walk an individual album and call back the creation functions
 */
Walk.day = function(year, month, day, options) {
    if (!year) throw 'no year';
    if (!month) throw 'no month';
    if (!day) throw 'no day';
    if (!options) throw 'no options';
    if (Walk.reachedMax) return;

    if (!FileUtils.isValidMonth(month)) {
        Log.warn('skip weird month: ' + year + '/' + month);
    }
    else if (!FileUtils.isValidDay(day)) {
        Log.warn('skip weird day: ' + year + '/' + month + '/' + day);
    }
    else {
        if (options.logSuccesses) {
            //console.log('processing: %s/%s/%s', year, month, day);
            Log.info('processing: %s/%s/%s', year, month, day);
        }

        AlbumStore.get(year, month, day, options, function(album) {
            Walk.processAlbum(album, options);

            // for each photo in week
            FileUtils.getFiles(Config.yearDirBase + '/' + year + '/' + month + '/' + day).forEach(function (photoName) {
                Walk.processPhoto(album.getPhoto(photoName), options);
            });
        });
    }
};

/**
 * Process a single album
 */
Walk.processAlbum = function(album, options) {
    if (!album) throw 'null album';
    if (!options) throw 'no options';
    if (Walk.reachedMax) return;

    if (options.logDescriptionIssues && StringUtils.containsUrlsAndOtherThingsToFix(album.description())) {
        Log.warn('album %s/%s-%s description needs processing: %s', album.year, album.month, album.day, album.description());
    }

    var xmp = Xmp.albumXmp(album.title(), album.description(), album.summary(), album.exifDate());
    if (options.write) {
        FileUtils.writeFile(album.targetYearDir(), album.xmpFilename(), xmp, options);
    }
    else if (options.logSuccesses) {
        Log.info('Would have written album: %s/%s-%s', album.year, album.month, album.day);
    }
};

/**
 * Process a single photo
 */
Walk.processPhoto = function(photo, options) {
    if (!photo) throw 'no photo';
    if (!options) throw 'no options';
    if (Walk.reachedMax) return;

    if (!photo.isKnownImageType()) {
        Log.warn('skip (unhandled extension): %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.filename);
    }
    else if (photo.noJsonData()) {
        Log.warn('skip (no json): %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.targetFilename());
    }
    // It's a jpg or bmp, with JSON data
    // It's valid to be transferred
    else {
        if (options.logSuccesses) {
            Log.info('processing: %s/%s/%s/%s', photo.year, photo.month, photo.day, photo.filename);
        }

        if (options.logDescriptionIssues && StringUtils.containsUrlsAndOtherThingsToFix(photo.description())) {
            Log.warn('photo %s/%s-%s description needs processing: %s', photo.year, photo.month, photo.day, photo.description());
        }

        var xmp = Xmp.imageXmp(photo.title(), photo.description(), photo.exifDate());
        if (options.write) {
            FileUtils.writeFile(photo.targetDir(), photo.xmpFilename(), xmp, options);

            // copy the actual image over
            FileUtils.copyFile(photo.sourceFile(), photo.targetDir(), photo.targetFilename(), options);
        }
        else if (options.logSuccesses) {
            Log.info('Would have written photo: %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.targetFilename());
            //console.log('\ttarget: %s', photo.targetFile());
            //console.log('xmp ', xmp);
        }
    }

    Walk.numProcessed = Walk.numProcessed + 1;
	var maxToProcess = options.maxPhotosToProcess ? options.maxPhotosToProcess : 1;
    if (Walk.numProcessed >= maxToProcess) {
        Walk.reachedMax = true;
        console.log('EXIT'.red + 'Reached max # photos to process: ' + maxToProcess);
    }
};

module.exports = Walk;