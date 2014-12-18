'use strict';

/**
 * Retrieves JSON albums, either from disk (2001-2006) or from a web service (2007-2014)
 */

var Log = require('./log.js');
var Config = require('./config.js');
var Album = require('./album.js');
var FileUtils = require('./fileutils.js');
var fs = require('fs');
var http = require('http');

var AlbumStore = {};
module.exports = AlbumStore;

AlbumStore.invalidAlbums = [
    '2007/01-04',
    '2007/01-07'
];

AlbumStore.get = function(year, month, day, options, callback) {
    if (!year) throw 'no year';
    if (!month) throw 'no month';
    if (!day) throw 'no day';
    if (!options) throw 'no options';

    var path = year + '/' + month + '-' + day;
    var albumPath = Config.jsonDirBase + '/' + path + '/album.json';

    // retrieve data from filesystem, if available
    try {
        var albumData = JSON.parse(fs.readFileSync(albumPath, 'utf8'));
        var album = new Album(year, month, day, albumData);
        if (options.logSuccesses) {
            console.log('\tretrieved album JSON from filesystem: %s', path);
        }
        callback(album);
    }
    catch(e) {
        // if it's a file not found error
        if (e.code === 'ENOENT') {
            console.log('\talbum has no JSON on disk: %s/%s-%s', year, month, day);

            // if it's in Gallery2, attempt to retrieve it
            var isDynamic = year > 2006;
            if (isDynamic) {
                if (AlbumStore.invalidAlbums.indexOf(path) >= 0) {
                    Log.warn('\tskipping album %s (probably the 500 server error problem)', path);
                    return;
                }
                var url = 'http://tacocat.com/pictures/main.php?g2_view=json.Album&album=' + path;
                console.log('\tretrieving album JSON from %s', url);
                http.get(url, function (res) {
                    //console.log('STATUS: ' + res.statusCode);
                    //console.log('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    var body = '';
                    res.on('data', function (chunk) {
                        body += chunk;
                    });
                    res.on('end', function () {
                        if (!body) {
                            throw 'Got no data for album ' + path;
                        }

                        var albumData = JSON.parse(body);

                        if (options.write) {
                            // save to disk
                            albumData = JSON.stringify(albumData, null, 2);
                            FileUtils.writeFile(Config.jsonDirBase + '/' + path, 'album.json', albumData, options);
                            // read back from disk to verify it wrote correctly
                            albumData = JSON.parse(fs.readFileSync(albumPath, 'utf8'));
                        }
                        else {
                            console.log('\tWould have written %s', Config.jsonDirBase + '/' + path, 'album.json');
                        }

                        var album = new Album(year, month, day, albumData);
                        callback(album);
                    });
                }.bind(options)).on('error', function (e) {
                    console.log("Got error: " + e.message);
                });

            }
        }
        // else I don't know what the error is, rethrow it
        else {
            throw e;
        }
    }
};