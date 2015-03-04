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
bitRunner.register('build', function buildPipeline(task) {
  task
    .load('index.js')
    .action(printPreTransform)
    .action(babel)
    .action(minify.config({sourceMap: true}))
    .action(printPostTransform);
});

bitRunner.register('default', ['build']);

function printPreTransform(data) {
  console.log('Pre transform:\n', data.source);
}

function printPostTransform(data) {
  console.log('Post transform:\n', data.source);
}
```

#### run it
From example/minify directory

```
npm install bit-runner -g
npm install
bitrunner
```
