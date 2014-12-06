#!/usr/bin/env node

var fs = require('fs');
var PathUtils = require('path');
var FileUtils = require('./scripts/fileutils.js');
var yearDirBase = '/Volumes/MoBucket/Users/Dean\ Moses/Pictures/raw';
var dataDirBase = '/Users/moses/devgit/tacocat-gallery-data';
var year = '2003';

function getAlbum(year, month, week) {
	var albumPath = PathUtils.join(dataDirBase, year, month + '-' + week, 'album.json');
	return JSON.parse(fs.readFileSync(albumPath, 'utf8'));
}

function eachPhotoInYear(year, callback) {
	// for each month
	FileUtils.getSubDirs(yearDirBase + '/' + year).forEach(function(month) {
		// for each week
		FileUtils.getSubDirs(yearDirBase + '/' + year + '/' + month).forEach(function(week) {
			var album = getAlbum(year, month, week); // JSON album on disk

			// for each photo in week
			FileUtils.getFiles(yearDirBase + '/' + year + '/' + month + '/' + week).forEach(function(photo) {
				var photoName = photo.split('.');
				photoName.pop();
				photoName = photoName.join('.');
				var photoEntry = album.children[photoName];
				var description = '';
				if (photoEntry) {
					description = photoEntry.description;
				}
				callback(month, week, photo, description);
			});
		});
	});

}

eachPhotoInYear(year, function(month, week, photo, description) {
	console.log('photo: ', month, week, photo, description);
});