#!/usr/bin/env node
var fs = require('fs');
var minimist = require('minimist');
var through2 = require('through2');

var vtt = require('./../');

var argv = minimist(process.argv, {
    alias: {
        v: 'version',
        o: 'output'
    },
    boolean: ['version', 'help']
});

var headers = argv.headers && argv.headers.toString().split(argv.separator);
var filename = argv._[3];

if (argv.version) {
    console.log(require('./../package').version);
    process.exit(0);
}
var output = (argv.output && argv.output !== '-') ? fs.createWriteStream(argv.output) : process.stdout;

if (filename === '-' || !filename) input = process.stdin;
else if (fs.existsSync(filename)) input = fs.createReadStream(filename);
else {
    console.error('File: %s does not exist', filename);
    process.exit(2);
}

if (argv._[2] === 'parse') {
    input.pipe(vtt.parse())
        .pipe(through2.obj(function(obj, enc, cb) {
            cb(null, JSON.stringify(obj, null, '\t'))
        }))
        .pipe(output);
}
