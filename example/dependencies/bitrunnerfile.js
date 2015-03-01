var taskRunner = require('bit-runner');


/**
 * JavaScript pipeline
 */
function buildPipeline(task) {
  task
    .load('package.json')
    .then(function(moduleMeta) {
      console.log(moduleMeta);
    })
    .then(function(moduleMeta) {
      console.log(moduleMeta);
    });
}


/**
 * CoffeeScript pipeline
 */
function releasePipeline(task) {
  task
    .load('bitrunnerfile.js')
    .then(function(moduleMeta) {
      console.log(moduleMeta);
    });
}


/**
 * Minify pipeline
 */
function minifyPipeline(task) {
  task
    .load('.jshintrc')
    .then(function(moduleMeta) {
      console.log(moduleMeta);
    });
}


taskRunner
  .register('build', ['print', 'minify'], buildPipeline)
  .register('release', ['minify'], releasePipeline)
  .register('minify', minifyPipeline);
