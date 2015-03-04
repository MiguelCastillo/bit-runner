# bit-runner
> JavaScript Task Runner to build and run pipeline (task sequences).

bit-runner's primary goal is to execute tasks, and the engine that executes these tasks is optimized to reduce I/O operations by piping data from one task to another.

So, what is a task? A task is a list of *actions* that are executed in sequence to process your assets. *You* define these actions in the form of plugins, which can be to simply add `use strict;` to your JavaScript.

A task can also specify dependencies on other tasks. This allows you to define a uniform *task sequence* that executes as a single unit, where the output from one task is *piped* to the next task in the sequence to reduce unnecessary I/O.

An important feature of the ability to set task dependencies is that you can piece together sequences of micro tasks to build complex pipelines - micro tasks are tasks that do small jobs (actions).

When bit-runner executes a task sequence, it runs completely independent from other task sequences. For example, if you run a task `build` and a task `release` simultaneously, they will both run in isolation, even if they had common task dependencies. This allows for elegant compositions of sequences of micro tasks.

> A task is what bit-runner executes, and an actions is what a task executes. bit-runner executes a sequence of tasks, and a task executes a sequence of actions.

> Task sequences run in isolation.


#### Illustration of a task sequence

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


### Examples
Please see [examples](https://github.com/MiguelCastillo/bit-runner/tree/master/example) that illustrate different techniques for configuring bit-runner.

### Plugins
To recap. bit-runner runs tasks and tasks run actions. These actions are just functions that have been abstracted out into modules, which we refer to as plugins. So at the atomic level, a plugin is just a function that is called upon when data needs to be processed. And in general, the item of interest in the data is the `source` property, which is the *content* loaded from storage.


#### Available plugins
You can click [here](https://www.npmjs.com/browse/keyword/bit-runner) to see a list of bit-runner plugins plublished in [npm](https://www.npmjs.com/).


#### Authoring plugins
When writing a plugin, keep in mind the basic rule that plugins are focused small units of work. Meaning, a plugin should do one thing and do it well. So don't over complicate a plugin by overloading it with functionality that could otherwise be broken out into smaller plugins. Or worse yet, functionality that already exists.

> Before you write and publish a plugin, please check if there is one that already does the job.

As we mentioned earlier, a plugin is a just a function. And a *very* basic plugin has the following structure:

``` javascript
function bar(data) {
  console.log(data);
}

module.exports = bar;
```

Which you would use it as follows:

``` javascript
var bar = require('bar')

taskRunner.register('foo', function(task) {
  task.action(bar);
});
```

If you want to create a configurable plugin, you can use the extended structure:

``` javascript
function bar(data) {
  _run(data, {});
}

bar.config = function(options) {
  return function barDelegate(data) {
    _run(data, options);
  };
};

function _run(data, options) {
  // Do what you need to here
  console.log(data, options);
}

module.exports = bar;
```

Returning the delegate might seem a bit odd. But it makes the plugin more expressive when it is used.

``` javascript
var bar = require('bar')

taskRunner.register('foo', function(task) {
  task.action(bar.config({hello: world}));
});
```

You can take a look at [this one](https://github.com/MiguelCastillo/minify-bits/blob/master/index.js) to get an idea of what a full plugin looks like.

> bit-runner plugins are actually [bit loader](https://github.com/MiguelCastillo/bit-loader) *transforms*.  So you can generally use a bit loader transform as a bit-runner task actions.

### Setup

#### Install

You need to install *bit-runner* globally so that the bit-runner `cli` can be added to the *PATH*.  This way you can call `bitrunner` from anywhere to execute your tasks.
```
$ npm install bit-runner -g
```

Now that you have the cli in your *PATH*, you need to install bit-runner in your project in order for your bit-runner configuration to register tasks.  So from your project's root directory:
```
$ npm install bit-runner --save-dev
```

#### Configuration `bitrunnerfile.js`
When you execute bit-runner's cli, it automatically loads `bitrunnerfile.js` from your project in order to load your tasks. Here is a basic configuration with a single task called `build`:

``` javascript
var bitRunner = require('bit-runner');
var babel     = require('babel-bits');

/**
 * JavaScript build pipeline
 */
bitRunner.register('build', function buildPipeline(task) {
  task
    .load('index.js')
    .action(addStrict)
    .action(babel);
});

/**
 * Sample action. The `source` property is generally what actions operate on.
 */
function addStrict(moduleMeta) {
  moduleMeta.source = "'use strict;'\n" + moduleMeta.source;
}
```

#### Run your tasks
So, now that you have installed bit-runner and created a configuration in your project, you are ready to run your task(s). From your project's root directory:

```
$ bitrunner build
```

You can call bitrunner with a list of tasks, in which case bit-runner is going to run them in parallel. Or if you don't provide a task name, then the `default` task is executed.

The following will execute `build` and `docs` in parallel.
```
$ bitrunner build docs
```

The following will execute `default`
```
$ bitrunner
```
