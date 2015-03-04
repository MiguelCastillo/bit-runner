var _factory = {};
var slice = Array.prototype.slice;

function Factory(name, factoryDelegate) {
  if (_factory.hasOwnProperty(name)) {
    throw new TypeError('Task "' + name + '" is already registered');
  }
  _factory[name] = factoryDelegate;
}

Factory.create = function(name) {
  var factory = _factory[name];
  if (!factory) {
    throw new TypeError('Task "' + name + '" has not yet been registered');
  }
  return factory.apply(null, slice.call(arguments, 1));
};

module.exports = Factory;
