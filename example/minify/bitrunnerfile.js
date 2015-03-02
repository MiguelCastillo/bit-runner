var bitRunner = require('bit-runner');
var babel     = require('babel-bits');
var uglify    = require('uglify-js');

/**
 * JavaScript pipeline
 */
bitRunner.register('default', function buildPipeline(task) {
  task
    .load('index.js')
    .then(printPreTransform)
    .then(babel)
    .then(minify)
    .then(printPostTransform);
});


function printPreTransform(moduleMeta) {
  console.log('Pre transform:\n', moduleMeta.source);
}

function printPostTransform(moduleMeta) {
  console.log('Post transform:\n', moduleMeta.source);
}

function minify(moduleMeta) {
  moduleMeta.source = uglify.minify(moduleMeta.source, {fromString: true}).code;
}
