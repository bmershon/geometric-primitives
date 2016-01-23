var tape = require("tape"),
    fs = require('fs');
    require("./inDelta.js");

var glm = require("../gl-matrix-min.js");
vec3 = glm.vec3; //global
var geom = require("../GeomPrimitives.js");

tape("Triangle ABC: (1, 0, 0), (0, 1, 0), (1, 1, 1)", function(test) {
  var a = vec3.fromValues(1, 0, 0),
      b = vec3.fromValues(0, 1, 0),
      c = vec3.fromValues(1, 1, 1);
  test.inDelta(geom.getTriangleArea(a, b, c), 0.86602540);
  test.end();
});

tape("Triangle ABC: (0.5, 0, 0), (0, 0.5, 0), (0, 0, 0)", function(test) {
  var a = vec3.fromValues(0.5, 0, 0),
      b = vec3.fromValues(0.0, 0.5, 0),
      c = vec3.fromValues(0.0, 0, 0);
  test.inDelta(geom.getTriangleArea(a, b, c), 1/2*(0.5)*(0.5));
  test.end();
});

tape("Triangle ABC: (-0.5, 0, 0), (0, 0.5, 0), (0, 0, 0)", function(test) {
  var a = vec3.fromValues(-0.5, 0, 0),
      b = vec3.fromValues(0.0, 0.5, 0),
      c = vec3.fromValues(0.0, 0, 0);
  test.inDelta(geom.getTriangleArea(a, b, c), 1/2*(0.5)*(0.5));
  test.end();
});

tape("Triangle ABC: (0, 0, 0), (0, 0, 0), (0, 0, 0)", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.clone(a),
      c = vec3.clone(a);
  test.inDelta(geom.getTriangleArea(a, b, c), 0.0);
  test.end();
});

tape("Triangle ABC: (0, -1, 4), (2, 4, 5), (0, 0, 9)", function(test) {
  var a = vec3.fromValues(0, -1, 4),
      b = vec3.fromValues(2, 4, 5),
      c = vec3.fromValues(0, 0, 9);
  test.inDelta(geom.getTriangleArea(a, b, c).toFixed(5), 13.03840);
  test.end();
});