'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var anObject = require('../internals/an-object');
var create = require('../internals/object-create');
var normalizeStringArgument = require('../internals/normalize-string-argument');

var nativeErrorToString = Error.prototype.toString;

var INCORRECT_TO_STRING = fails(function () {
  if (DESCRIPTORS) {
    // Chrome 32- incorrectly call accessor
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var object = create(Object.defineProperty({}, 'name', { get: function () {
      return String(this === object);
    } }));
    if (String(nativeErrorToString.call(object)) !== 'true') return true;
  }
  // FF10- does not properly handle non-strings
  return String(nativeErrorToString.call({ message: 1, name: 2 })) !== '2: 1'
    // IE8 does not properly handle defaults
    || String(nativeErrorToString.call({})) !== 'Error';
});

module.exports = INCORRECT_TO_STRING ? function toString() {
  var O = anObject(this);
  var name = normalizeStringArgument(O.name, 'Error');
  var message = normalizeStringArgument(O.message);
  return !name ? message : !message ? name : name + ': ' + message;
} : nativeErrorToString;
