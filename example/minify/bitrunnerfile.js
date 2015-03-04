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
