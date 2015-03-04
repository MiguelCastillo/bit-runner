var factory      = require('./factory');
var fetchFactory = require('./fetch');
var Bitloader    = require('bit-loader');
var util         = Bitloader.Utils;


/**
 * @class
 *
 * Task that can be executed by the task runner
 */
function Task(name, deps, cb, parent, root) {
  var task   = this;
  var loader = (parent && parent._loader) || new Bitloader({}, {fetch: fetchFactory});
  root = root || this;

  this._loader = loader;
  this._src    = [];
  this._tasks  = {};
  this.name    = name;
  this.init    = init.bind(this);
  this.run     = run.bind(this);
  this.load    = load.bind(this);
  this.action  = action.bind(this);

  function run() {
    init().then(exec);
  }

  function load(src) {
    // This is basically a source accumulator
    src = typeof(src) === 'string' ? [src] : src;
    if (src && src.length) {
      root._src = root._src.concat.apply(root._src, arguments);
    }
    return task;
  }

  function action(cb) {
    // This is a transform accumulator
    loader.transform.use(cb);
    return task;
  }

  function exec() {
    if (root._src.length) {
      return loader.import(root._src);
    }
  }

  function init() {
    return buildTree().then(function taskCallback() {
      if (typeof(cb) === 'function') {
        return cb.call(task, task);
      }
    });
  }

  function buildTree() {
    if (!deps.length) {
      return Bitloader.Promise.resolve();
    }

    return deps.reduce(function dep(deferredTask, name) {
      return deferredTask.then(subtask(name), util.printError);
    }, Bitloader.Promise.resolve());
  }

  function subtask(name) {
    return function substaskrunning() {
      if (root._tasks.hasOwnProperty(name)) {
        return Bitloader.Promise.resolve();
      }
      return (root._tasks[name] = Task.create(name, task, root)).init();
    };
  }
}


Task.prototype.init = function() {};
Task.prototype.run  = function() {};
Task.prototype.load = function() {};
Task.prototype.then = function() {};


Task.factory = function(name, deps, cb) {
  factory(name, function taskFactory(parent, root) {
    return new Task(name, deps, cb, parent, root);
  });
};

Task.create = function(name, parent, root) {
  return factory.create(name, parent, root);
};

module.exports = Task;
