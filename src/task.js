var fetchFactory = require('./fetch');
var Bitloader    = require('bit-loader');
var util         = Bitloader.Utils;


/**
 * @class
 *
 * Task that can be executed by the task runner
 */
function Task(taskrunner, name, deps, cb, parent) {
  var task   = this;
  var loader = (parent && parent._loader) || new Bitloader({}, {fetch: fetchFactory});
  var src;

  this._loader = loader;
  this._parent = parent;
  this._tasks  = {};
  this.name    = name;
  this.init    = init.bind(this);
  this.run     = run.bind(this);
  this.load    = load.bind(this);
  this.then    = then.bind(this);

  // Make sure to tell the parent we are their child!
  if (parent) {
    parent.setTask(name, this);
  }


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
          return runner.then(subtask(name), util.printError);
        }, Bitloader.Promise.resolve());

      return sequence.then(function() {
          if (src.length) {
            return loader.import(src);
          }
        }, util.printError);
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

  function subtask(name) {
    return function() {
      return taskrunner.subtask(name, task);
    };
  }
}


Task.prototype.getTask = function(name) {
  return this._tasks[name];
};


Task.prototype.setTask = function(name, task) {
  if (this._tasks[name]) {
    throw new TypeError('Subtask "' + name + '" already exists');
  }

  this._tasks[name] = task;
};


Task.prototype.init = function() {};
Task.prototype.run  = function() {};
Task.prototype.load = function() {};
Task.prototype.then = function() {};


module.exports = Task;
