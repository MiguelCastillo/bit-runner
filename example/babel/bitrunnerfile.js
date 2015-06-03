var bitRunner = require('bit-runner');
var babel     = require('babel-bits');
var addStrict = require('./add-strict');


function buildPipeline(task) {
  task
    .load('index.js')
    .action(printStart)
    .action(addStrict)
    .action(babel)
    .action(printEnd);
}

function printStart(data) {
  console.log('Start:\n', data.source);
}

function printEnd(data) {
  console.log('End:\n', data.source);
}


/**
 * JavaScript pipeline
 */
bitRunner
  .register('default', ['build'])
  .register('build', buildPipeline);
