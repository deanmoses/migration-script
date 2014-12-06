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
function eachPhotoInYear(year, callback) {
	// for each month
	FileUtils.getSubDirs(Config.yearDirBase + '/' + year).forEach(function(month) {
		if (!FileUtils.isValidMonth(month)) {
			console.log('weird month: %s/%s', year, month);
		}

		// for each week
		FileUtils.getSubDirs(Config.yearDirBase + '/' + year + '/' + month).forEach(function(week) {
			var album = new Album(year, month, week); // JSON album on disk
			// for each photo in week
			FileUtils.getFiles(Config.yearDirBase + '/' + year + '/' + month + '/' + week).forEach(function(photoName) {
				callback(album.getPhoto(photoName));
			});
		});
	});
}

/**
 * Process each photo in the year
 */
eachPhotoInYear(year, function(photo) {
	if (!photo.isKnownImageType()) {
		console.log('skip (unhandled extension): %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.filename);
	}
	else if (photo.noJsonData()) {
		console.log('skip (no json): %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.targetFilename());

		//if (photo.noTextDescription() && photo.description() !== photo.textDescription) {
		//	//console.log('descriptions differ: %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.filename);
		//	//console.log('   json: %s', photo.description);
		//	//console.log('    txt: %s', photo.textDescription);
		//}
	}
	// It's a jpg or bmp, with JSON data
	// It's valid to be transferred
	else {
		console.log('transfer: %s/%s-%s/%s', photo.year, photo.month, photo.day, photo.targetFilename());
		console.log('    from: %s', photo.sourceFile());
		console.log('      to: %s', photo.targetFile());

		//if (photo.isBmp()) {
		//	//console.log('    isBmp');
		//}
		//else if (StringUtils.endsWith(photo.filename, '.JPG')) {
		//	//console.log('     from: %s', photo.sourceFile());
		//	//console.log('       to: %s', photo.targetFile());
		//}
		//else if (StringUtils.endsWithIgnoreCase(photo.filename, '.jpeg')) {
		//	//console.log('     from: %s', photo.sourceFile());
		//	//console.log('       to: %s', photo.targetFile());
		//}
		var xmp = Xmp.imageXmp(photo.title(), photo.description(), photo.exifDate());
		console.log('xmp: \n', xmp);
	}

	//FileUtils.copyFile();
	process.exit();
});