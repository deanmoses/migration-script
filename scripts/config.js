/**
 * Created by moses on 12/6/14.
 */
'use strict';

var Config = {};

//
// Where the raw files are kept
//
//Config.yearDirBase = '/Volumes/MoBucket/Users/Dean\ Moses/Pictures/raw';
Config.yearDirBase = '/Users/moses/Dropbox/Family/Photos/raw';

//
// Where to read and write the file-based JSON
//
Config.jsonDirBase = '/Users/moses/devgit/tacocat-gallery-data';

//
// Where to put the newly munged photos and the .xmp files
//
//Config.targetDirBase = '/Users/moses/devgit/albums';
Config.targetDirBase = '/Users/moses/Dropbox/Family/Photos/albums';


module.exports = Config;