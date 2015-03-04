var Task      = require('./task');
var Bitloader = require('bit-loader');
var util      = Bitloader.Utils;


/**
 * @class
 *
 * @classdesc
 * Interface for registering and running tasks
 */
function TaskRunner() {
  this._tasks = {};

  // Bind so that we do not lose the context
  this.register = register.bind(this);
  this.run      = run.bind(this);
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


/** @private */
function register(name, deps, cb) {
  if (!util.isString(name)) {
    throw new TypeError('Must provide a name for the task');
  }

  if (util.isFunction(deps)) {
    cb = deps;
    deps = [];
  }

  // Set a task factory
  Task.factory(name, deps, cb);
  return this;
}


/** @private */
function run(name) {
  var task = this._tasks[name] || (this._tasks[name] = Task.create(name));
  task.run();
  return this;
}


module.exports = new TaskRunner();
