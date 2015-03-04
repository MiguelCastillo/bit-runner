var bitRunner = require('bit-runner');

/**
 * JavaScript pipeline
 */
bitRunner.register('build', function buildPipeline(task) {
  task
    .load('index.js')
    .action(printPreTransform)
    .action(addStrict)
    .action(printPostTransform);
});


function printPreTransform(data) {
  console.log('Pre transform:\n', data.source);
}

function printPostTransform(data) {
  console.log('Post transform:\n', data.source);
}

function addStrict(data) {
  data.source = '"use strict;"\n' + data.source;
}
