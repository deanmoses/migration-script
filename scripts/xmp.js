'use strict';

var Xmp = {};

Xmp.toXmp = function(elements){
    if (!elements) throw 'elements cannot be empty';
    if (!(elements instanceof Array)) throw 'elements must be array';

    var xmp = '<x:xmpmeta>\n';
    var arrayLength = elements.length;
    for (var i = 0; i < arrayLength; i++) {
        var element = elements[i];
        if (!element.name) throw 'element ' + i + ' does not have a name';
        if (!element.value) throw 'element ' + i + ' does not have a value';

        var tag = '\t<' + element.name + '>' + element.value + '</' + element.name + '>\n'
        xmp += tag;
    }
    xmp += '</x:xmpmeta>';
    return xmp;
};

module.exports = Xmp;