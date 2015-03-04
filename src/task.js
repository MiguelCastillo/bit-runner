var factory      = require('./factory');
var fetchFactory = require('./fetch');
var Bitloader    = require('bit-loader');
var util         = Bitloader.Utils;


/**
 * @class
 *
 * @classdesc
 * Task that can be executed by the task runner
 */
function Task(name, deps, cb, parent, root) {
  var task = this;
  root = root || this;

  if (root === this) {
    this._loader = new Bitloader({}, {fetch: fetchFactory});
    this._tasks  = {};
    this._src    = [];
  }

  this.name   = name;
  this.load   = load.bind(this);
  this.action = action.bind(this);
  this.run    = run.bind(this);
  this._init  = init.bind(this);


  function run() {
    init().then(exec, util.printError);
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
    root._loader.transform.use(cb);
    return task;
  }

  function exec() {
    if (root._src.length) {
      return root._loader.import(root._src);
    }
  }

  function init() {
    return buildTree().then(function taskCallback() {
      if (typeof(cb) === 'function') {
        return cb.call(task, task);
      }
    }, util.printError);
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
      return (root._tasks[name] = Task.create(name, task, root))._init();
    };
  }
}


/**
 * Method to run the task. This is where the task tree is instantiated and the
 * root task is executed.
 */
Task.prototype.run = function() {};


/**
 * Method to load file(s) from storage in order to put them through the
 * transformatin pipeline.
 *
 * @param {string | string[]} name - Name or array of names of files to be
 *  loaded.
 *
 * @returns {Task} Returns itself
 */
Task.prototype.load = function() {};


/**
 * Method to register an action handler to receive data whenever there is data
 * that needs processing.
 *
 * @param {function} handler - Called when there is data that needs processing.
 *
 * @returns {Task} Returns itself
 */
Task.prototype.action = function() {};


/**
 * Method that initializes the hierarchy of tasks so that they can be later
 *  ran
 *
 * @returns {Promise} That will resolve when all the tasks have been created.
 * @private
 */
Task.prototype._init = function() {};


Task.factory = function(name, deps, cb) {
  factory(name, function taskFactory(parent, root) {
    return new Task(name, deps, cb, parent, root);
  });
};


Task.create = function(name, parent, root) {
  return factory.create(name, parent, root);
};


module.exports = Task;
