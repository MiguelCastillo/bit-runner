var taskRunner = require('bit-runner');


/**
 * JavaScript pipeline
 */
function jsPipeline(task) {
  task
    .load('index.js')
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
function coffeePipeline(task) {
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
  .register('javascript', ['coffeescript', 'minify'], jsPipeline)
  .register('coffeescript', coffeePipeline)
  .register('minify', minifyPipeline);

