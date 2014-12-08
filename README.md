Dynamic Album Migration Script
================
Node.js script to assist in migrating the Tacocat.com gallery's dynamic HTML albums (2007-2014) to Zenphoto.

This script takes the raw originals from backup, copies them into a folder structure amenable to Zenphoto, and adds .xmp sidecar files for both the photos and the albums, containing info like titles and descriptions.

The .xmp info comes from the Gallery2 JSON web service, another github project: https://github.com/deanmoses/tacocat-gallery-php-json
