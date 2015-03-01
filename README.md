# bit-runner
JS Task Runner

The underlying engine is [bit loader](https://github.com/MiguelCastillo/bit-loader) to provide the *transformation* workflow for modules.

### Setup

#### Install

First, you need to install *bit-runner* globally so that it's cli can be added to the *PATH*.  This way you can call `bitrunner` from anywhere.
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
function jsPipeline(task) {
  task
    .load('index.js')
    .then(function(moduleMeta) {
      moduleMeta.source = "'use strict;'\n" + moduleMeta.source;
    })
    .then(function(moduleMeta) {
      moduleMeta.source = coffeescript.compile(moduleMeta.source);
    });
}

taskRunner.register('build', jsPipeline);
```

#### Running it
Now that you have installed bit-runner, configured it in your probject, now you are ready to run it.  From your project's root directory:

```
bitrunner build
```

You can call bitrunner with a list of registered tasks, in which case bit runner is going to run them all in parallel. Or if you don't provide a task name, then a `default` task is executed.


### Examples
Please see [examples](https://github.com/MiguelCastillo/bit-runner/tree/master/example) to see some examples.
