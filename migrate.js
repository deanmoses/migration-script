#!/usr/bin/env node

var Walk = require('./scripts/walk.js');

var options = {
	write: true, // false: don't write files, just log what you WOULD do if you ran it
	logSuccesses: true // false: don't log successful files.  good for looking at only the failures / weird files
};
var year = '2006';
var month = '11';
var day = '10';

Walk.year(year, options);
//Walk.month(year, month, options);
//Walk.day(year, month, day, options);