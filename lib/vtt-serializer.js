var stream = require('stream');
var fs = require('fs');
var inherits = require('inherits');

module.exports = function() {
    return new Serializer();
};

var Serializer = function() {
    stream.Transform.call(this, {objectMode:true, highWaterMark:16})
};

inherits(Serializer, stream.Transform);

// This assumes that chunk is the full JSON object because the corresponding
// parser doesn't stream JSON. This may change if requested.
Serializer.prototype._transform = function(chunk, enc, cb) {
    var obj = JSON.parse(chunk);

    obj.items.forEach(function(item) {
        if (item.type == "cue") {
            var start = fromSeconds(item.startTime),
                end = fromSeconds(item.endTime);

            this.push(start + ' --> ' + end + '\n');

            item.payload.forEach(function(payloadLine) {
                this.push(payloadLine + '\n');
            }, this);

            this.push('\n');
        }
    }, this);
    cb();
};

function fromSeconds(time) {
    var date = new Date(null);
    var st = time.toString().split('.');
    date.setSeconds(st[0]);
    if (st[1]) {
        date.setMilliseconds(('.' + st[1]) * 1000);
    }
    return date.toISOString().substr(11, 12);
}
