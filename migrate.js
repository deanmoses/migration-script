#!/usr/bin/env node

var Config = require('./scripts/config.js');
var StringUtils = require('./scripts/stringutils.js');
var FileUtils = require('./scripts/fileutils.js');
var Album = require('./scripts/album.js');
var Xmp = require('./scripts/xmp.js');

var year = '2003';

/**
 * Find each photo in the year and pass it to the callback function
 */
function walkYear(year, albumCallback, photoCallback) {
	// for each month
	FileUtils.getSubDirs(Config.yearDirBase + '/' + year).forEach(function(month) {
		if (!FileUtils.isValidMonth(month)) {
			console.log('weird month: %s/%s', year, month);
		}

		// for each week
		FileUtils.getSubDirs(Config.yearDirBase + '/' + year + '/' + month).forEach(function(week) {
			var album = new Album(year, month, week);
			albumCallback(album);

			// for each photo in week
			FileUtils.getFiles(Config.yearDirBase + '/' + year + '/' + month + '/' + week).forEach(function(photoName) {
				photoCallback(album.getPhoto(photoName));
			});
		});
	});
}


/**
 * Process a single album
 * @param album Album object
 */
function processAlbum(album) {
	if (!album) {
		throw 'null album';
	}

	console.log('album: %s %s', album.year, album.title());
	//console.log('    dir: %s', album.targetDir());
	//console.log('    xmp: %s', album.xmpFile());

	if (album.summary()) {
		console.log('       summary: %s', album.summary());
	}
	if (album.description()) {
		//console.log('   description: %s', album.description());
	}

	var xmp = Xmp.albumXmp(album.title(), album.description(), album.summary(), album.exifDate());
	//console.log('xmp: \n%s', xmp);
	console.log('xmp file: \n%s', album.xmpFile());
	FileUtils.writeFile(album.targetYearDir(), album.xmpFilename(), xmp);
}

/**
 * Process a single photo
 * @param photo Photo object
 */
function processPhoto(photo) {
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
		//console.log('transfer: %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.targetFilename());
		//console.log('    from: %s', photo.sourceFile());
		//console.log('      to: %s', photo.targetFile());

		var xmp = Xmp.imageXmp(photo.title(), photo.description(), photo.exifDate());
		//console.log('xmp: \n', xmp);
		console.log('xmp file: %s', photo.xmpFile());
		FileUtils.writeFile(photo.targetDir(), photo.xmpFilename(), xmp);

		//FileUtils.copyFile();
	}

	process.exit();
}

/**
 * Process each photo in the year
 */
walkYear(year, processAlbum, processPhoto);