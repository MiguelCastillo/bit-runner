var bitRunner = require('bit-runner');

/**
 * JavaScript pipeline
 */
function buildPipeline(task) {
  task
    .load('index.js')
    .then(function(moduleMeta) {
      moduleMeta.source = "'use strict;'\n" + moduleMeta.source;
    });
}

taskRunner.register('build', buildPipeline);
