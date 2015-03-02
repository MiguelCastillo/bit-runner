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
