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
