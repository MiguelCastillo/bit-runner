var bitRunner = require('bit-runner');

/**
 * JavaScript pipeline
 */
bitRunner.register('build', function buildPipeline(task) {
  task
    .load('index.js')
    .then(printPreTransform)
    .then(addStrict)
    .then(printPostTransform);
});


function printPreTransform(moduleMeta) {
  console.log('Pre transform:\n', moduleMeta.source);
}

function printPostTransform(moduleMeta) {
  console.log('Post transform:\n', moduleMeta.source);
}

function addStrict(moduleMeta) {
  moduleMeta.source = '"use strict;"\n' + moduleMeta.source;
}
