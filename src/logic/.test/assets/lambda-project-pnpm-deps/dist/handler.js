'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.handler = void 0;
// This simulates a handler that imports a package which has its own dependencies
var main_package = require('main-package');
var handler = function () {
  return main_package.doSomething();
};
exports.handler = handler;
