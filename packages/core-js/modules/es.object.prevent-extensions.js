var isObject = require('core-js-internals/is-object');
var onFreeze = require('../internals/meta').onFreeze;

// `Object.preventExtensions` method
// https://tc39.github.io/ecma262/#sec-object.preventextensions
require('../internals/object-statics-accept-primitives')('preventExtensions', function (nativePreventExtensions) {
  return function preventExtensions(it) {
    return nativePreventExtensions && isObject(it) ? nativePreventExtensions(onFreeze(it)) : it;
  };
});