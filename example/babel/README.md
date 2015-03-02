# Babel example
Example showing how to add a [babel](https://babeljs.io/) task to transform ES6 code to ES5 equivalent.

The bitrunner config file has a `default` task that just runs `build`

## bitrunnerconfig.js

``` javascript
var bitRunner      = require('bit-runner');
var babelTransform = require('babel-bits');
var addStrict      = require('./add-strict');

/**
 * JavaScript pipeline
 */
bitRunner.register('build', function buildPipeline(task) {
  task
    .load('index.js')
    .then(printPreTransform)
    .then(addStrict)
    .then(babelTransform)
    .then(printPostTransform);
});


// Register default task
bitRunner.register('default', ['build']);


function printPreTransform(moduleMeta) {
  console.log('Pre transform:\n', moduleMeta.source);
}

function printPostTransform(moduleMeta) {
  console.log('Post transform:\n', moduleMeta.source);
}
```

#### run it
From example/bable directory

```
npm install bit-runner -g
npm install
bitrunner build
```
