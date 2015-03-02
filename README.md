# bit-runner
JS Task Runner that's easily configured to run complex sequences of tasks.

> The underlying engine is [bit loader](https://github.com/MiguelCastillo/bit-loader) to provide the *transformation* workflow.


### Summary
bit runner's primary goal is to executes tasks. But the pipeline that executes these tasks is optimized to reduce I/O operations by piping data from one task to another.

So, what is a task?  A task is a sequence of *actions* that are executed to process your assests. *You* define what these actions are. An action can be to simply add `use strict;` to your JavaScript.

A task can also sepecify dependencies on other tasks.  This allows you to define a uniform *task sequence* that executes as a single unit, where the output from one task is *piped* to the next task in the sequence to reduce unnecessary I/O.

An important feature of the ability to set dependencies is that you can piece together complex sequences of micro tasks - tasks that do small jobs. When a task is executed by the `cli`, its execution sequence is completely independent from other tasks' execution sequence. For example, you could run `bitrunner build`, and that task will run completely independent from `bitrunner release`, even if they have common task dependencies and they are executed simultaneously. This allows for elegant compositions of sequences of micro tasks.

> Quick note: A task is what bit runner executes. Actions is what a task executes.  Bit runner executes a sequence of tasks, and a task executes a sequence of actions.


#### Oversimplified illustration of a task sequence

- Task: read from disk
  - Action: read `file1.js`
- Task: transpile
  - Action: run [babel](https://babeljs.io/)
- Task: build
  - Action: add `use strict`
  - Action: add `# sourceURL`
  - Action: load dependencies
- Task: minify
  - Action: run [uglify](https://github.com/mishoo/UglifyJS2)

In all that sequence, there was only one read from disk!


### Setup

#### Install

First, you need to install *bit-runner* globally so that the bit-runner cli can be added to the *PATH*.  This way you can call `bitrunner` from anywhere.
```
npm install bit-runner -g
```

Now that you have the cli in your *PATH*, you need to install bit-runner in your project.  So from your project's root directory:
```
npm install bit-runner --save-dev
```

#### Configuration `bitrunnerfile.js`
When you execute bit runner's cli, it automatically loads `bitrunnerfile.js` from your project in order to load your tasks. Here is a basic configuration with a single task called `build`:

``` javascript
var bitRunner      = require('bit-runner');
var babelTransform = require('babel-bits');

/**
 * JavaScript build pipeline
 */
bitRunner.register('build', function buildPipeline(task) {
  task
    .load('index.js')
    .then(addStrict)
    .then(babelTransform);
});

/**
 * Sample action. The `source` property is generally what actions operate on.
 */
function addStrict(moduleMeta) {
  moduleMeta.source = "'use strict;'\n" + moduleMeta.source;
}
```

#### Running it
So, you have installed bit-runner and created a configuration in your project. Now you are ready to run your task(s). From your project's root directory:

```
bitrunner build
```

You can call bitrunner with a list of tasks, in which case bit runner is going to run them in parallel. Or if you don't provide a task name, then the `default` task is executed.

The following will execute `build` and `docs` in parallel.
```
bitrunner build docs
```

The following will execute `default`
```
bitrunner
```


### Examples
Please see [examples](https://github.com/MiguelCastillo/bit-runner/tree/master/example) that illustrate different techniques for configuring bit runner.
