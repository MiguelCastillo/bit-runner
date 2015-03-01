# bit-runner
JS Task Runner that can be really easily configured to run complex sequences of tasks.

> The underlying engine is [bit loader](https://github.com/MiguelCastillo/bit-loader) to provide the *transformation* workflow.


### Summary
bit runner primary goal is to executes tasks. But the pipeline that executes these tasks is optimaized to reduce I/O operations by piping data from one task to another.

So, what is a task?  A task is a sequence of *actions* that are executed to process your assests. *You* define what these actions are. An action can be to simply add `use strict;` to your JavaScript.

A task can also sepecify dependencies on other tasks.  This allows you to define a uniform task sequence that executes as a single unit. The output from one task is *piped* to the next task in the sequence to avoid unnecessary I/O.


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

Now that you have the cli in your *PATH* you need bit-runner in each project you want bit runner setup.  So from your project's root directory:
```
npm install bit-runner
```

#### Config
Bit runner uses `bitrunnerfile.js` to configure your tasks, and here is a basic one with a single task called `build`:

``` javascript
var bitRunner = require('bit-runner');

/**
 * JavaScript pipeline
 */
function buildPipeline(task) {
  task
    .load('index.js')
    .then(function action(moduleMeta) {
      moduleMeta.source = "'use strict;'\n" + moduleMeta.source;
    })
    .then(function action(moduleMeta) {
      moduleMeta.source = coffeescript.compile(moduleMeta.source);
    });
}

bitRunner.register('build', buildPipeline);
```

#### Running it
Now that you have installed bit-runner, configured it in your probject, now you are ready to run it.  From your project's root directory:

```
bitrunner build
```

You can call bitrunner with a list of registered tasks, in which case bit runner is going to run them all in parallel. Or if you don't provide a task name, then the `default` task is executed.


### Examples
Please see [examples](https://github.com/MiguelCastillo/bit-runner/tree/master/example) that illustrate different techniques for configuring bit runner.
