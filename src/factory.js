var _factory = {};
var slice = Array.prototype.slice;


/**
 * Registers a named factory delegate so that when Factory.create is called,
 * we know what factory needs to be called.
 *
 * @param {string} name - Name of the factory to register
 * @param {function} factoryDelegate - Function to call to create instances
 */
function Factory(name, factoryDelegate) {
  if (_factory.hasOwnProperty(name)) {
    throw new TypeError('Task "' + name + '" is already registered');
  }
  _factory[name] = factoryDelegate;
}


/**
 * Calls a registered factory delegate in order to create an instance of an
 * object.
 *
 * @param {string} name - Name of the factory to call
 *
 * @returns {*} Instance created by the factory
 */
Factory.create = function(name) {
  var factory = _factory[name];
  if (!factory) {
    throw new TypeError('Task "' + name + '" has not yet been registered');
  }
  return factory.apply(null, slice.call(arguments, 1));
};


module.exports = Factory;
