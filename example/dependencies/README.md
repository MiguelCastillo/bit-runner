# Task dependency example
This example will show you how you can define multiple tasks, and establish dependencies amongst them. The primary task (target) is build, which has a dependency on `print` and `minify` (two artificial taska).  And then `print` has a dependency on `minify`.  This makes sure that before `build` runs, `print` and `minify`, and before `print` runs, `minify` runs.

The one thing to pay attention to is these tasks can be chained in any way you need, and they will be completely independent.  For example, you could run `print`, and task will run completely independent of the `print` task from `build`.  This allows maximum reuse of tasks where you can create a bunch little micro tasks that you chain together in whatever way you need.

#### run it
(from example/dependencies directory)

```
npm install
bitrunner build
```
