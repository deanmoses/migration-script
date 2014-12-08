Static Album Migration Script
================
Node.js script to assist in migrating the static HTML albums from 2001-2006 (plus a few earlier) to Zenphoto.

This script takes the raw originals from backup, copies them into a folder structure amenable to Zenphoto, and adds .xmp sidecar files for both the photos and the albums, containing info like titles and descriptions.

The .xmp info comes from the static website, but via JSON files.  I scraped all the static HTML albums and created JSON for them, and checked the results into github: https://github.com/deanmoses/tacocat-gallery-data
