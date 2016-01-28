var tape = require("tape"),
    gl_matrix = require("../lib/gl-matrix-min.js"),
    geom = require("../build/gl-geom.js");

global.vec3 = gl_matrix.vec3;

require("./inDelta.js"); // add functionality

tape("Parallel SEGMENTS A(0, 0, 0), B(4, 4, 0), C(5, 7, 0), D(9, 11, 0)", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.fromValues(4, 4, 0),
      c = vec3.fromValues(5, 7, 0),
      d = vec3.fromValues(9, 11, 0);
  test.notOk(geom.getLineSegmentIntersection(a, b, c, d), "Parallel lines with no intersection");
  test.end();
});

tape("SEGMENTS Coincide A(0, 0, 0), B(5, 7, 0), C(0, 0, 0), D(10, 14, 0)", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.fromValues(5, 7, 0),
      c = vec3.fromValues(0, 0, 0),
      d = vec3.fromValues(10, 14, 0);
  test.notOk(geom.getLineSegmentIntersection(a, b, c, d), "Segments coincide, no unique intersection point");
  test.end();
});

tape("Skew LINES A(0, 0, 2), B(0, 0, 0), C(5, 0, 0), D(1, 0, 0)", function(test) {
  var a = vec3.fromValues(0, 0, 2),
      b = vec3.fromValues(0, 1, 0),
      c = vec3.fromValues(5, 0, 0),
      d = vec3.fromValues(1, 0, 0);
  test.notOk(geom.getLineIntersection(a, b, c, d));
  test.end();
});


tape("Skew LINES least squares solution A(0, 0, 2), B(0, 0, 0), C(5, 0, 0), D(1, 0, 0)", function(test) {
  var a = vec3.fromValues(0, 0, 2),
      b = vec3.fromValues(0, 1, 0),
      c = vec3.fromValues(5, 0, 0),
      d = vec3.fromValues(1, 0, 0);
  test.ok(geom.getLineIntersection(a, b, c, d, true));
  test.end();
});
