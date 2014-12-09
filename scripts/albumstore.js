'use strict';

/**
 * Retrieves JSON albums, either from disk (2001-2006) or from a web service (2007-2014)
 */

var Config = require('./config.js');
var Album = require('./album.js');
var http = require('http');
var fs = require('fs');

var AlbumStore = {};
module.exports = AlbumStore;

AlbumStore.invalidAlbums = [
    '2007/01-04',
    '2007/01-07'
];

AlbumStore.get = function(year, month, day, callback) {
    var isDynamic = year > 2006;
    if (isDynamic) {
        var path = year + '/' + month + '-' + day;
        if (AlbumStore.invalidAlbums.indexOf(path) >= 0) {
            console.log('skipping album %s (probably the 500 server error problem)', path);
            return;
        }
        var url = 'http://tacocat.com/pictures/main.php?g2_view=json.Album&album=' + path;
        console.log('retrieving album from %s', url);
        http.get(url, function(res) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function () {
                var albumData = JSON.parse(body);
                //console.log('BODY: ', albumData);
                if (!albumData) {
                    throw 'Got no data for album ' + path;
                }
                var album = new Album(year, month, day, albumData);
                callback(album);
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });

        //throw 'Cannot process albums from 2007 and up yet ' + url;
    }
    // else it's a 2006 or earlier album, data is in JSON on filesystem
    else {
        // retrieve data from filesystem, if available
        try {
            var albumPath = Config.jsonDirBase + '/' + year + '/' + month + '-' + day + '/album.json';
            var albumData = JSON.parse(fs.readFileSync(albumPath, 'utf8'));
            var album = new Album(year, month, day, albumData);
            callback(album);
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
};