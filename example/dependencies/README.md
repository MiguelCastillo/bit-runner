# Task dependency example
A task can sepecify dependencies on other tasks in order to define a uniform task sequence that executes as a single unit. The output from one task is *piped* to the next task in the sequence to avoid unnecessary I/O.

This example will show you how you can define multiple tasks, and establish dependencies amongst them. The primary task is `build`, which has a dependency on `release` and `minify` (two artificial tasks). Furthermore, the `release` task has a dependency on `minify`.

This setup will makes sure that before `build` runs, `release` and `minify` do.  And before `release` runs, `minify` does.  When you run the `build` task, this creates a sequence like this:

1. `build` -> [`release`, `minify`]
2. `release` -> `minify`

The end result is executing the tasks in the following order:

1. `minify`
2. `release`
3. `build`

One thing that is important to note is that registered tasks can be chained in any way you need. And when a task is executed by the `cli`, their execution sequence is completely independent from other tasks' execution sequence.  For example, you could run `bitrunner build`, and that task will run completely independent from the `bitrunner release`.  This allows maximum reuse of tasks where you can create a bunch little micro tasks that you chain together in whatever way you need.

## bitrunnerconfig.js

``` javascript
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
```

#### run it
From example/dependencies directory

```
npm install bit-runner -g
npm install
bitrunner build
```
