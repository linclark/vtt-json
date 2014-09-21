vtt-json
========

This project parses to JSON and serializes back to the .vtt format, not to HTML. This makes it easy to manipulate the cue timeline (e.g. adding time between two cues).

It does not follow the [http://dev.w3.org/html5/webvtt/#parsing](WebVTT parser algorithm) and is not meant as an implementation of WebVTT. For that, you should look to the [node-vtt](https://www.npmjs.org/package/node-vtt) project. It also does not validate .vtt files. For that, you should look to the [webvtt](https://github.com/humphd/node-webvtt) project.

Usage
=====

### Pipe example

```
var fs = require('fs'),
    vtt = require('vtt-json');

var input = fs.createReadStream('input.vtt');
var output = fs.createWriteStream('output.json');

input.pipe(vtt.parse())
    .pipe(through2.obj(function(obj, enc, cb) {
        cb(null, JSON.stringify(obj, null, '\t'))
    }))
    .pipe(output);
```

### Command line tool

Files can also be converted from .vtt to JSON on the command line.

```
vtt-json parse input.vtt --output=output.json
```

Related projects
================
[node-vtt](https://www.npmjs.org/package/node-vtt)
[webvtt](https://github.com/humphd/node-webvtt)&mdash;A validator for WebVTT files.