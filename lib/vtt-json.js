var Parser = require('./vtt-parser');
var Serializer = require('./vtt-serializer');

module.exports.parse = function() {
    return Parser();
};

module.exports.serialize = function() {
    return Serializer();
};
