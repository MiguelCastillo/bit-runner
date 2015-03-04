var bitRunner = require('bit-runner');
var babel     = require('babel-bits');
var addStrict = require('./add-strict');

/**
 * JavaScript pipeline
 */
bitRunner.register('build', function buildPipeline(task) {
  task
    .load('index.js')
    .action(printPreTransform)
    .action(addStrict)
    .action(babel)
    .action(printPostTransform);
});


// Register default task
bitRunner.register('default', ['build']);


function printPreTransform(data) {
  console.log('Pre transform:\n', data.source);
}

function printPostTransform(data) {
  console.log('Post transform:\n', data.source);
}
