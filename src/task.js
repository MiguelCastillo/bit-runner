var Bitloader = require('bit-loader');
var Utils     = Bitloader.Utils;


/**
 * @class
 *
 * Task that can be executed by the task runner
 */
function Task(taskrunner, name, deps, cb, loader) {
  var task = this;
  var src;

  function init(args) {
    src = [];

    if (typeof(cb) === 'function') {
      cb.apply(task, [task].concat(args));
    }

    return task;
  }

  function run() {
    if (deps.length) {
      var sequence = deps.reduce(function(runner, name) {
          return runner.then(chainTask(name), Utils.printError);
        }, Bitloader.Promise.resolve());

      return sequence.then(function() {
          if (src.length) {
            return loader.import(src);
          }
        }, Utils.printError);
    }
    else if (src.length) {
      return loader.import(src);
    }
  }

  function load() {
    src = src.concat.apply(src, arguments);
    return task;
  }

  function then(cb) {
    loader.transform.use(cb);
    return task;
  }

  function chainTask(name) {
    return function() {
      return taskrunner.chain(loader, name);
    };
  }

  this.name = name;
  this.init = init.bind(this);
  this.run  = run.bind(this);
  this.load = load.bind(this);
  this.then = then.bind(this);
}


module.exports = Task;
