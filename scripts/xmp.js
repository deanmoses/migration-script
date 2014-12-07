'use strict';

var StringUtils = require('./stringutils.js');

var Xmp = {};

/**
 * Return a string representing an image's XMP sidecar file
 *
 * @param title
 * @param description
 * @param date '2014-12-31'
 */
Xmp.imageXmp = function(title, description, date) {
    var xmp = Xmp.xmpTagOpen;
    xmp += Xmp.rdfTagOpen;
    if (!!title || !!description) {
        xmp += Xmp.dcContainerTagOpen;
        if (title) {
            xmp += Xmp.dcTitle(title);
        }

        if (description) {
            xmp += Xmp.dcDescription(description);
        }
        xmp += Xmp.dcContainerTagClose;
    }
    if (date) {
        xmp += Xmp.exifContainerTagOpen;
        xmp += Xmp.exifDate(date);
        xmp += Xmp.exifContainerTagClose;
    }
    xmp += Xmp.rdfTagClose;
    xmp += Xmp.xmpTagClose;

    return xmp;
};

/**
 * Return a string representing an album's XMP sidecar file
 *
 * @param date '2014-12-31'
 */
Xmp.albumXmp = function(title, description, summary, date) {
    var xmp = Xmp.xmpTagOpen;
    xmp += Xmp.rdfTagOpen;
    if (!!title || !!description) {
        xmp += Xmp.dcContainerTagOpen;
        if (title) {
            xmp += Xmp.dcTitle(title);
        }

        if (description) {
            xmp += Xmp.dcDescription(description);
        }
        xmp += Xmp.dcContainerTagClose;
    }
    if (date) {
        xmp += Xmp.exifContainerTagOpen;
        xmp += Xmp.exifDate(date);
        xmp += Xmp.exifContainerTagClose;
    }
    xmp += Xmp.rdfTagClose;
    if (summary) {
        xmp += Xmp.customData(summary);
    }
    xmp += Xmp.xmpTagClose;

    return xmp;
};


Xmp.dcTitle = function(title) {
    return Xmp.tag('dc:title', title);
};

Xmp.dcDescription = function(description) {
    return Xmp.tag('dc:description', description);
};

Xmp.exifDate = function(date) {
    return Xmp.tag('exif:DateTimeOriginal', date);
};

Xmp.customData = function(summary) {
    return Xmp.tag('zp:CustomData', summary);
}

Xmp.tag = function(tagname, value) {
    return '\n\t\t\t<' + tagname + '>' + StringUtils.encodeHtml(value) + '</' + tagname + '>';
};

Xmp.xmpTagOpen = '<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 4.2-c020 1.124078, Tue Sep 11 2007 23:21:40">';
Xmp.xmpTagClose = '\n</x:xmpmeta>';
Xmp.rdfTagOpen = '\n\t<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">';
Xmp.rdfTagClose = '\n\t</rdf:RDF>';
Xmp.dcContainerTagOpen = '\n\t\t<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">';
Xmp.dcContainerTagClose = '\n\t\t</rdf:Description>';
Xmp.exifContainerTagOpen = '\n\t\t<rdf:Description rdf:about="" xmlns:exif="http://ns.adobe.com/exif/1.0/">';
Xmp.exifContainerTagClose = '\n\t\t</rdf:Description>';

module.exports = Xmp;