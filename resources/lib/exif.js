
/*
 * Javascript EXIF Reader - jQuery plugin 0.1.3
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */

(function($) {

var BinaryFile = function(strData, iDataOffset, iDataLength) {
    var data = strData;
    var dataOffset = iDataOffset || 0;
    var dataLength = 0;

    this.getRawData = function() {
        return data;
    };

    if (typeof strData == "string") {
        dataLength = iDataLength || data.length;

        this.getByteAt = function(iOffset) {
            return data.charCodeAt(iOffset + dataOffset) & 0xFF;
        };
    } else if (typeof strData == "unknown") {
        dataLength = iDataLength || IEBinary_getLength(data);

        this.getByteAt = function(iOffset) {
            return IEBinary_getByteAt(data, iOffset + dataOffset);
        };
    }

    this.getLength = function() {
        return dataLength;
    };

    this.getSByteAt = function(iOffset) {
        var iByte = this.getByteAt(iOffset);
        if (iByte > 127)
            return iByte - 256;
        else
            return iByte;
    };

    this.getShortAt = function(iOffset, bBigEndian) {
        var iShort = bBigEndian ?
            (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
            : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset);
        if (iShort < 0) iShort += 65536;
        return iShort;
    };
    this.getSShortAt = function(iOffset, bBigEndian) {
        var iUShort = this.getShortAt(iOffset, bBigEndian);
        if (iUShort > 32767)
            return iUShort - 65536;
        else
            return iUShort;
    };
    this.getLongAt = function(iOffset, bBigEndian) {
        var iByte1 = this.getByteAt(iOffset),
            iByte2 = this.getByteAt(iOffset + 1),
            iByte3 = this.getByteAt(iOffset + 2),
            iByte4 = this.getByteAt(iOffset + 3);

        var iLong = bBigEndian ?
            (((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
            : (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
        if (iLong < 0) iLong += 4294967296;
        return iLong;
    };
    this.getSLongAt = function(iOffset, bBigEndian) {
        var iULong = this.getLongAt(iOffset, bBigEndian);
        if (iULong > 2147483647)
            return iULong - 4294967296;
        else
            return iULong;
    };
    this.getStringAt = function(iOffset, iLength) {
        var aStr = [];
        for (var i=iOffset,j=0;i<iOffset+iLength;i++,j++) {
            aStr[j] = String.fromCharCode(this.getByteAt(i));
        }
        return aStr.join("");
    };

    this.getCharAt = function(iOffset) {
        return String.fromCharCode(this.getByteAt(iOffset));
    };
    this.toBase64 = function() {
        return window.btoa(data);
    };
    this.fromBase64 = function(strBase64) {
        data = window.atob(strBase64);
    };
};


var BinaryAjax = (function() {

    function createRequest() {
        var oHTTP = null;
        if (window.XMLHttpRequest) {
            oHTTP = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            oHTTP = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return oHTTP;
    }

    function getHead(strURL, fncCallback, fncError) {
        var oHTTP = createRequest();
        if (oHTTP) {
            if (fncCallback) {
                if (typeof(oHTTP.onload) != "undefined") {
                    oHTTP.onload = function() {
                        if (oHTTP.status == "200") {
                            fncCallback(this);
                        } else {
                            if (fncError) fncError();
                        }
                        oHTTP = null;
                    };
                } else {
                    oHTTP.onreadystatechange = function() {
                        if (oHTTP.readyState == 4) {
                            if (oHTTP.status == "200") {
                                fncCallback(this);
                            } else {
                                if (fncError) fncError();
                            }
                            oHTTP = null;
                        }
                    };
                }
            }
            oHTTP.open("HEAD", strURL, true);
            oHTTP.send(null);
        } else {
            if (fncError) fncError();
        }
    }

    function sendRequest(strURL, fncCallback, fncError, aRange, bAcceptRanges, iFileSize) {
        var oHTTP = createRequest();
        if (oHTTP) {

            var iDataOffset = 0;
            if (aRange && !bAcceptRanges) {
                iDataOffset = aRange[0];
            }
            var iDataLen = 0;
            if (aRange) {
                iDataLen = aRange[1]-aRange[0]+1;
            }

            if (fncCallback) {
                if (typeof(oHTTP.onload) != "undefined") {
                    oHTTP.onload = function() {

                        if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                            this.binaryResponse = new BinaryFile(this.responseText, iDataOffset, iDataLen);
                            this.fileSize = iFileSize || this.getResponseHeader("Content-Length");
                            fncCallback(this);
                        } else {
                            if (fncError) fncError();
                        }
                        oHTTP = null;
                    };
                } else {
                    oHTTP.onreadystatechange = function() {
                        if (oHTTP.readyState == 4) {
                            if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                                this.binaryResponse = new BinaryFile(oHTTP.responseBody, iDataOffset, iDataLen);
                                this.fileSize = iFileSize || this.getResponseHeader("Content-Length");
                                fncCallback(this);
                            } else {
                                if (fncError) fncError();
                            }
                            oHTTP = null;
                        }
                    };
                }
            }
            oHTTP.open("GET", strURL, true);

            if (oHTTP.overrideMimeType) oHTTP.overrideMimeType('text/plain; charset=x-user-defined');

            if (aRange && bAcceptRanges) {
                oHTTP.setRequestHeader("Range", "bytes=" + aRange[0] + "-" + aRange[1]);
            }

            oHTTP.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");

            oHTTP.send(null);
        } else {
            if (fncError) fncError();
        }
    }

    return function(strURL, fncCallback, fncError, aRange) {

        if (aRange) {
            getHead(
                strURL,
                function(oHTTP) {
                    var iLength = parseInt(oHTTP.getResponseHeader("Content-Length"),10);
                    var strAcceptRanges = oHTTP.getResponseHeader("Accept-Ranges");

                    var iStart, iEnd;
                    iStart = aRange[0];
                    if (aRange[0] < 0)
                        iStart += iLength;
                    iEnd = iStart + aRange[1] - 1;

                    sendRequest(strURL, fncCallback, fncError, [iStart, iEnd], (strAcceptRanges == "bytes"), iLength);
                }
            );

        } else {
            sendRequest(strURL, fncCallback, fncError);
        }
    };

}());


document.write(
    "<script type='text/vbscript'>\r\n"
    + "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
    + " IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n"
    + "End Function\r\n"
    + "Function IEBinary_getLength(strBinary)\r\n"
    + " IEBinary_getLength = LenB(strBinary)\r\n"
    + "End Function\r\n"
    + "</script>\r\n"
);


var EXIF = {};

(function() {

var bDebug = true;


EXIF.TiffTags = {
    0x0112 : "Orientation",
};


function imageHasData(oImg)
{
    return !!(oImg.exifdata);
}

function getImageData(oImg, fncCallback)
{
    BinaryAjax(
        oImg.src,
        function(oHTTP) {
            var oEXIF = findEXIFinJPEG(oHTTP.binaryResponse);
            oImg.exifdata = oEXIF || {};
            if (fncCallback) fncCallback();
        }
    );
}

function findEXIFinJPEG(oFile) {
    var aMarkers = [];

    if (oFile.getByteAt(0) != 0xFF || oFile.getByteAt(1) != 0xD8) {
        if (bDebug) console.log('not a valid jpg')
        return false; // not a valid jpeg
    }

    var iOffset = 2;
    var iLength = oFile.getLength();
    while (iOffset < iLength) {
        if (oFile.getByteAt(iOffset) != 0xFF) {
            if (bDebug) console.log("Not a valid marker at offset " + iOffset + ", found: " + oFile.getByteAt(iOffset));
            return false; // not a valid marker, something is wrong
        }

        var iMarker = oFile.getByteAt(iOffset+1);

        // we could implement handling for other markers here,
        // but we're only looking for 0xFFE1 for EXIF data

        if (iMarker == 22400) {
            if (bDebug) console.log("Found 0xFFE1 marker");
            return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset+2, true)-2);
            // iOffset += 2 + oFile.getShortAt(iOffset+2, true);
            // WTF?

        } else if (iMarker == 225) {
            // 0xE1 = Application-specific 1 (for EXIF)
            if (bDebug) console.log("Found 0xFFE1 marker");
            return readEXIFData(oFile, iOffset + 4, oFile.getShortAt(iOffset+2, true)-2);

        } else {
            iOffset += 2 + oFile.getShortAt(iOffset+2, true);
        }

    }

}


function readTags(oFile, iTIFFStart, iDirStart, oStrings, bBigEnd)
{
    var iEntries = oFile.getShortAt(iDirStart, bBigEnd);
    var oTags = {};
    for (var i=0;i<iEntries;i++) {
        var iEntryOffset = iDirStart + i*12 + 2;
        var strTag = oStrings[oFile.getShortAt(iEntryOffset, bBigEnd)];
        if (!strTag && bDebug) console.log("Unknown tag: " + oFile.getShortAt(iEntryOffset, bBigEnd));
        oTags[strTag] = readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd);
    }
    return oTags;
}


function readTagValue(oFile, iEntryOffset, iTIFFStart, iDirStart, bBigEnd)
{
    var iType = oFile.getShortAt(iEntryOffset+2, bBigEnd);
    var iNumValues = oFile.getLongAt(iEntryOffset+4, bBigEnd);
    var iValueOffset = oFile.getLongAt(iEntryOffset+8, bBigEnd) + iTIFFStart;

    switch (iType) {
        case 1: // byte, 8-bit unsigned int
        case 7: // undefined, 8-bit byte, value depending on field
            if (iNumValues == 1) {
                return oFile.getByteAt(iEntryOffset + 8, bBigEnd);
            } else {
                var iValOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
                var aVals = [];
                for (var n=0;n<iNumValues;n++) {
                    aVals[n] = oFile.getByteAt(iValOffset + n);
                }
                return aVals;
            }
            break;

        case 2: // ascii, 8-bit byte
            var iStringOffset = iNumValues > 4 ? iValueOffset : (iEntryOffset + 8);
            return oFile.getStringAt(iStringOffset, iNumValues-1);
            // break;

        case 3: // short, 16 bit int
            if (iNumValues == 1) {
                return oFile.getShortAt(iEntryOffset + 8, bBigEnd);
            } else {
                var iValOffset = iNumValues > 2 ? iValueOffset : (iEntryOffset + 8);
                var aVals = [];
                for (var n=0;n<iNumValues;n++) {
                    aVals[n] = oFile.getShortAt(iValOffset + 2*n, bBigEnd);
                }
                return aVals;
            }
            // break;

        case 4: // long, 32 bit int
            if (iNumValues == 1) {
                return oFile.getLongAt(iEntryOffset + 8, bBigEnd);
            } else {
                var aVals = [];
                for (var n=0;n<iNumValues;n++) {
                    aVals[n] = oFile.getLongAt(iValueOffset + 4*n, bBigEnd);
                }
                return aVals;
            }
            break;
        case 5: // rational = two long values, first is numerator, second is denominator
            if (iNumValues == 1) {
                return oFile.getLongAt(iValueOffset, bBigEnd) / oFile.getLongAt(iValueOffset+4, bBigEnd);
            } else {
                var aVals = [];
                for (var n=0;n<iNumValues;n++) {
                    aVals[n] = oFile.getLongAt(iValueOffset + 8*n, bBigEnd) / oFile.getLongAt(iValueOffset+4 + 8*n, bBigEnd);
                }
                return aVals;
            }
            break;
        case 9: // slong, 32 bit signed int
            if (iNumValues == 1) {
                return oFile.getSLongAt(iEntryOffset + 8, bBigEnd);
            } else {
                var aVals = [];
                for (var n=0;n<iNumValues;n++) {
                    aVals[n] = oFile.getSLongAt(iValueOffset + 4*n, bBigEnd);
                }
                return aVals;
            }
            break;
        case 10: // signed rational, two slongs, first is numerator, second is denominator
            if (iNumValues == 1) {
                return oFile.getSLongAt(iValueOffset, bBigEnd) / oFile.getSLongAt(iValueOffset+4, bBigEnd);
            } else {
                var aVals = [];
                for (var n=0;n<iNumValues;n++) {
                    aVals[n] = oFile.getSLongAt(iValueOffset + 8*n, bBigEnd) / oFile.getSLongAt(iValueOffset+4 + 8*n, bBigEnd);
                }
                return aVals;
            }
            break;
    }
}


function readEXIFData(oFile, iStart, iLength)
{
    if (oFile.getStringAt(iStart, 4) != "Exif") {
        if (bDebug) console.log("Not valid EXIF data! " + oFile.getStringAt(iStart, 4));
        return false;
    }

    var bBigEnd;

    var iTIFFOffset = iStart + 6;

    // test for TIFF validity and endianness
    if (oFile.getShortAt(iTIFFOffset) == 0x4949) {
        bBigEnd = false;
    } else if (oFile.getShortAt(iTIFFOffset) == 0x4D4D) {
        bBigEnd = true;
    } else {
        if (bDebug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
        return false;
    }

    if (oFile.getShortAt(iTIFFOffset+2, bBigEnd) != 0x002A) {
        if (bDebug) console.log("Not valid TIFF data! (no 0x002A)");
        return false;
    }

    if (oFile.getLongAt(iTIFFOffset+4, bBigEnd) != 0x00000008) {
        if (bDebug) console.log("Not valid TIFF data! (First offset not 8)", oFile.getShortAt(iTIFFOffset+4, bBigEnd));
        return false;
    }

    var oTags = readTags(oFile, iTIFFOffset, iTIFFOffset+8, EXIF.TiffTags, bBigEnd);

    return oTags;
}


EXIF.getData = function(oImg, fncCallback)
{
    if (!oImg.complete) return false;
    if (!imageHasData(oImg)) {
        getImageData(oImg, fncCallback);
    } else {
        if (fncCallback) fncCallback();
    }
    return true;
};

EXIF.getTag = function(oImg, strTag)
{
    if (!imageHasData(oImg)) return;
    return oImg.exifdata[strTag];
};

EXIF.getAllTags = function(oImg)
{
    if (!imageHasData(oImg)) return {};
    var oData = oImg.exifdata;
    var oAllTags = {};
    for (var a in oData) {
        if (oData.hasOwnProperty(a)) {
            oAllTags[a] = oData[a];
        }
    }
    return oAllTags;
};

EXIF.readFromBinaryFile = function(oFile) {
    return findEXIFinJPEG(oFile);
};


// load data for images manually
$.fn.exifLoad = function(fncCallback) {
    return this.each(function() {
        EXIF.getData(this, fncCallback);
    });
};

$.fn.exif = function(strTag) {
    var aStrings = [];
    this.each(function() {
        aStrings.push(EXIF.getTag(this, strTag));
    });
    return aStrings;
};

$.fn.exifAll = function() {
    var aStrings = [];
    this.each(function() {
        aStrings.push(EXIF.getAllTags(this));
    });
    return aStrings;
};

var getFilePart = function(file) {
    if (file.slice) {
        filePart = file.slice(0, 131072);
    } else if (file.webkitSlice) {
        filePart = file.webkitSlice(0, 131072);
    } else if (file.mozSlice) {
        filePart = file.mozSlice(0, 131072);
    } else {
        filePart = file;
    }

    return filePart;
};

$.fn.fileExif = function(callback) {
    var reader = new FileReader();

    reader.onload = function(event) {
        var content = event.target.result;

        var binaryResponse = new BinaryFile(content);

        callback(EXIF.readFromBinaryFile(binaryResponse));
    };

    reader.readAsBinaryString(getFilePart(this[0].files[0]));
};

$.fileExif = function(file, callback) {
    var reader = new FileReader();

    reader.onload = function(event) {
        var content = event.target.result;

        var binaryResponse = new BinaryFile(content);

        callback(EXIF.readFromBinaryFile(binaryResponse));
    };

    reader.readAsBinaryString(getFilePart(file));
};


})();

})(jQuery);