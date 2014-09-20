vtt-json
========

This project parses to JSON and serializes back to the .vtt format, not to HTML. This makes it easy to manipulate the cue timeline (e.g. adding time between two cues).

It does not follow the [http://dev.w3.org/html5/webvtt/#parsing](WebVTT parser algorithm) and is not meant as an implementation of WebVTT. For that, you should look to the [node-vtt](https://www.npmjs.org/package/node-vtt) project. It also does not validate .vtt files. For that, you should look to the [webvtt](https://github.com/humphd/node-webvtt) project.


Related projects
================
[node-vtt](https://www.npmjs.org/package/node-vtt)
[webvtt](https://github.com/humphd/node-webvtt)&mdash;A validator for WebVTT files.