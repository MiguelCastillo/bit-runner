var Task      = require('./task');
var Bitloader = require('bit-loader');
var util      = Bitloader.Utils;
var slice     = Array.prototype.slice;


/**
 * @class
 *
 * Interface for registering and running tasks
 */
function TaskRunner() {
  this._tasks   = {};
  this._factory = {};

  // Bind so that we do not lose the context
  this.register = register.bind(this);
  this.run      = runtask.bind(this);
  this.subtask  = runsubtask.bind(this);
}


/** Convenieve promise provider */
TaskRunner.prototype.Promise = Bitloader.Promise;

/** Convenience utilities */
TaskRunner.prototype.util = util;

/** Method to register a task */
TaskRunner.prototype.register = function() {};


/**
 * Method to run a task without providing back a wayt to tell when the task is
 * done.
 *
 * @param {string} name - Name of the task to run
 *
 * @returns {TaskRunner}
 */
TaskRunner.prototype.run = function() {};


/**
 * Method to run a subtask task and return a promise that will be resolved when the
 * subtask is finished
 *
 * @param {string} name - Name of the task to run
 *
 * @returns {Promise}
 */
TaskRunner.prototype.subtask = function() {};


/** @private */
function register(name, deps, cb) {
  if (!util.isString(name)) {
    throw new TypeError('Must provide a name for the task');
  }

  if (util.isFunction(deps)) {
    cb = deps;
    deps = [];
  }

  if (this._factory.hasOwnProperty(name)) {
    throw new TypeError('Task "' + name + '" is already registered');
  }

  // Set a task factory
  this._factory[name] = taskFactory.call(this, name, deps, cb);
  return this;
}


/** @private */
function runtask(name) {
  var task = this._tasks[name] || (this._tasks[name] = createTask.call(this, name));
  _run(task, slice.call(arguments, 1));
  return this;
}


/** @private */
function runsubtask(name, parent) {
  var subtask = parent.getTask(name) || createTask.call(this, name, parent);
  return _run(subtask, slice.call(arguments, 2));
}


/** @private */
function _run(task) {
  return task
    .init(slice.call(arguments, 1))
    .run();
}


/** @private */
function createTask(name, parent) {
  var factory = this._factory.hasOwnProperty(name);

  if (!factory) {
    throw new TypeError('Task "' + name + '" has not yet been registered');
  }

  return this._factory[name](parent);
}


/** @private */
function taskFactory(name, deps, cb) {
  var taskRunner = this;
  return function factory(parent) {
    return new Task(taskRunner, name, deps, cb, parent);
  };
}


module.exports = new TaskRunner();
