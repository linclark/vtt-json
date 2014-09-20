var stream = require('stream');
var fs = require('fs');
var inherits = require('inherits');
var split = require('split');
var objectAssign = require('object-assign');

var Parser = function() {
    stream.Transform.call(this, {objectMode:true, highWaterMark:16})

    this._bufferTail = null;
    this._currentItem = null;
    this._cueLoopStarted = false;
    this._retObj = { items: [] };
};

inherits(Parser, stream.Transform);

Parser.prototype._transform = function(chunk, enc, cb) {
    if (chunk instanceof Buffer) {
        chunk = chunk.toString();
    }

    if (this._bufferTail === null) {
        chunk = this._bufferTail + chunk;
    }

    var NEWLINE = /\r\n|\r|\n/;
    var lines = chunk.split(NEWLINE);

    this._bufferTail = lines.pop();

    while (lines.length > 0) {
        line = lines.shift();
        this._handleLine(line);
    }
    cb();
};

Parser.prototype._flush = function(cb) {
    if (this._bufferTail !== null) {
        this._handleLine(this._bufferTail);
    }
    this._pushCurrentItem();
    debugger

    this.push(this._retObj);
    cb();
};

Parser.prototype._handleLine = function(line) {
    if (line.length === 0) {
        this._pushCurrentItem();
    }
    else if (line.indexOf("NOTE") === 0) {
        this._initCurrentItem();
        this._currentItem.type = "comment";
        line.replace("NOTE", "");
        this._currentItem.payload.push(line);
    }
    else if (line.indexOf( "-->" ) !== -1) {
        if (this._currentItem === null) {
            this._initCurrentItem();
            // This might already be set to true, but set it just in case.
            this._cueLoopStarted = true;
        }
        this._currentItem.type = "cue";
        this._currentItem.id = line;
        objectAssign(this._currentItem, parseCueHeader(line));
    }
    else if (this._currentItem === null && this._cueLoopStarted) {
        this._initCurrentItem();
        this._currentItem.type = "cue";
        this._currentItem.id = line;
    }
    else if (this._cueLoopStarted) {
        this._currentItem.payload.push(line);
    }
};

Parser.prototype._initCurrentItem = function() {
    // Parsing for commented out attributes has not been implemented yet.
    this._currentItem =  {
        id: "",
        startTime: 0,
        endTime: 0,
//        pauseOnExit: false,
//        direction: "horizontal",
//        snapToLines: true,
//        linePosition: "auto",
//        textPosition: 50,
//        size: 100,
//        alignment: "middle",
        // Use payload instead of text here because it will be handled as an
        // array. A text property can later be added, concat-ing the payload.
        payload: []
//        tree: null
    }
}

Parser.prototype._pushCurrentItem = function() {
    if (this._currentItem !== null) {
        if (this._currentItem.payload !== [] && this._currentItem.endTime > this._currentItem.startTime) {
            this._retObj.items.push(this._currentItem);
        }
        this._currentItem = null
    }
};

module.exports = function() {
    return new Parser()
};

function parseCueHeader(line) {
    var cue = {},
        rToken = /-->/,
        rWhitespace = /[\t ]+/;
    var lineSegments = line.replace( rToken, " --> " ).split( rWhitespace );

    if ( lineSegments.length < 2 ) {
        throw "Bad cue";
    }

    cue.startTime = toSeconds( lineSegments[ 0 ] );
    cue.endTime = toSeconds( lineSegments[ 2 ] );

    return cue;
}

function toSeconds ( t_in ) {
    var t = t_in.split( ":" ),
        l = t_in.length,
        time;

    // Invalid time string provided
    if ( l !== 12 && l !== 9 ) {
        throw "Bad cue";
    }

    l = t.length - 1;

    try {
        time = parseInt( t[ l-1 ], 10 ) * 60 + parseFloat( t[ l ], 10 );

        // Hours were given
        if ( l === 2 ) {
            time += parseInt( t[ 0 ], 10 ) * 3600;
        }
    } catch ( e ) {
        throw "Bad cue";
    }

    return time;
}