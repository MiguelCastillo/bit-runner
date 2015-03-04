# Basic example
This will show you a really basic example where we are defining a task that adds `use strict;` to the source. The only task defined is called `build`.


## bitrunnerconfig.js

``` javascript
var bitRunner = require('bit-runner');

/**
 * JavaScript pipeline
 */
bitRunner.register('build', function buildPipeline(task) {
  task
    .load('index.js')
    .action(printPreTransform)
    .action(addStrict)
    .action(printPostTransform);
});


function printPreTransform(data) {
  console.log('Pre transform:\n', data.source);
}

function printPostTransform(data) {
  console.log('Post transform:\n', data.source);
}

function addStrict(data) {
  data.source = '"use strict;"\n' + data.source;
}
```

#### run it
From example/basic directory

```
npm install bit-runner -g
npm install
bitrunner build
```
