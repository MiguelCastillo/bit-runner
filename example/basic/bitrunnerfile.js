var bitRunner = require('bit-runner');

/**
 * JavaScript pipeline
 */
function buildPipeline(task) {
  task
    .load('index.js')
    .then(function(moduleMeta) {
      console.log('Pre transform:\n', moduleMeta.source);
    })
    .then(function(moduleMeta) {
      moduleMeta.source = '"use strict;"\n' + moduleMeta.source;
    })
    .then(function(moduleMeta) {
      console.log('Post transform:\n', moduleMeta.source);
    });
}

bitRunner.register('build', buildPipeline);
