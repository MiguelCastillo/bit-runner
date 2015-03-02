# Minify example
Example showing how to add a [minify](https://github.com/mishoo/UglifyJS2#the-simple-way) and a [babel](https://babeljs.io/) task to transform ES6 code to ES5 equivalent, and then minifying it including source maps.

## bitrunnerconfig.js

``` javascript
var bitRunner = require('bit-runner');
var babel     = require('babel-bits');
var minify    = require('minify-bits');

/**
 * JavaScript pipeline
 */
bitRunner.register('default', function buildPipeline(task) {
  task
    .load('index.js')
    .then(printPreTransform)
    .then(babel)
    .then(minify.config({sourceMap: true}))
    .then(printPostTransform);
});

function printPreTransform(moduleMeta) {
  console.log('Pre transform:\n', moduleMeta.source);
}

function printPostTransform(moduleMeta) {
  console.log('Post transform:\n', moduleMeta.source);
}
```

#### run it
From example/minify directory

```
npm install bit-runner -g
npm install
bitrunner
```
