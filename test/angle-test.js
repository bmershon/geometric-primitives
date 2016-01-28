var tape = require("tape"),
    gl_matrix = require("../gl-matrix-min.js"),
    geom = require("../build/gl-geom.js");

global.vec3 = gl_matrix.vec3;

require("./inDelta.js"); // add functionality

tape("A(0, 0, 0), B(0, 1, 0), C(0, 0, 1) -> π/2", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.fromValues(0, 1, 0),
      c = vec3.fromValues(0, 0, 1);
  test.equal(geom.getAngle(a, b, c), Math.PI/2);
  test.end();
});

tape("A(-1, 0, 0), B(0, 0, 0), C(1, 0, 0) -> 0", function(test) {
  var a = vec3.fromValues(-1, 0, 0),
      b = vec3.fromValues(0, 0, 0),
      c = vec3.fromValues(1, 0, 0);
  test.equal(geom.getAngle(a, b, c), 0);
  test.end();
});

tape("A(0, 0, 0), B(-1, 0, 0), C(1, 0, 0) -> π", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.fromValues(-1, 0, 0),
      c = vec3.fromValues(1, 0, 0);
  test.equal(geom.getAngle(a, b, c), Math.PI);
  test.end();
});

