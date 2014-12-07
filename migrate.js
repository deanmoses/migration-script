#!/usr/bin/env node

var Walk = require('./scripts/walk.js');

var write = true; // false: don't write files, just log what you WOULD do if you ran it
var year = '2003';
var month = '07';
var day = '30';

//Walk.day(year, month, day, write);

Walk.month(year, month, write);