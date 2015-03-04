var bitRunner = require('bit-runner');


/**
 * JavaScript pipeline
 */
function buildPipeline(task) {
  task
    .load('package.json')
    .action(function(data) {
      console.log(data);
    })
    .action(function(data) {
      console.log(data);
    });
}


/**
 * CoffeeScript pipeline
 */
function releasePipeline(task) {
  task
    .load('bitrunnerfile.js')
    .action(function(data) {
      console.log(data);
    });
}


/**
 * Minify pipeline
 */
function minifyPipeline(task) {
  task
    .load('.jshintrc')
    .action(function(data) {
      console.log(data);
    });
}


bitRunner
  .register('default', ['build'])
  .register('build', ['release', 'minify'], buildPipeline)
  .register('release', ['minify'], releasePipeline)
  .register('minify', minifyPipeline);
