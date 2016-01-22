/**
 * From Mike Bostock
 * https://github.com/d3/d3-ease/blob/master/test/inDelta.js
 */

var tape = require("tape");

tape.Test.prototype.inDelta = function(actual, expected) {
  this._assert(expected - 1e-6 < actual && actual < expected + 1e-6, {
    message: "should be in delta",
    operator: "inDelta",
    actual: actual,
    expected: expected
  });
};