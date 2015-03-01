var Task         = require('./task');
var fetchFactory = require('./fetch');
var Bitloader    = require('bit-loader');
var Utils        = Bitloader.Utils;
var slice        = Array.prototype.slice;


/**
 * @class
 *
 * Interface for registering and running tasks
 */
function TaskRunner() {
  this._tasks = {};

  // Bind so that we do not lose the context
  this.register = register.bind(this);
  this.run      = run.bind(this);
  this.chain    = chain.bind(this);
}


/** Convenieve promise provider */
TaskRunner.prototype.Promise = Bitloader.Promise;

/** Convenience utilities */
TaskRunner.prototype.util = Utils;

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
 * Method to run a task and returns a promise that will be resolved when the
 * task is finished
 *
 * @param {string} name - Name of the task to run
 *
 * @returns {Promise}
 */
TaskRunner.prototype.chain = function() {};


/** @private */
function register(name, deps, cb) {
  var taskRunner = this;

  if (!Utils.isString(name)) {
    throw new TypeError('Must provide a name for the task');
  }

  if (Utils.isFunction(deps)) {
    cb = deps;
    deps = [];
  }

  if (this._tasks.hasOwnProperty(name)) {
    throw new TypeError('Task "' + name + '" is already registered');
  }

  // Set a task factory
  this._tasks[name] = function taskFactory(loader) {
    return new Task(taskRunner, name, deps, cb, loader);
  };

  return this;
}


/** @private */
function run() {
  this.chain.apply(this, [new Bitloader({}, {fetch: fetchFactory})].concat(slice.call(arguments)));
  return this;
}


/** @private */
function chain(loader, name) {
  var task = this._tasks[name];

  if (!task) {
    throw new TypeError('Task "' + name + '" not found');
  }

  return task(loader)
    .init(slice.call(arguments, 2))
    .run();
}


module.exports = new TaskRunner();
