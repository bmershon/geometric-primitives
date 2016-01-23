var tape = require("tape"),
    fs = require('fs');
    require("./inDelta.js"),
    geom = require("../GeomPrimitives.js");

tape("Point Above: A(1, 0, 0), B(0, 1, 0), C(0, 0, 0) and D(1, 2, 3)", function(test) {
  var a = vec3.fromValues(1, 0, 0),
      b = vec3.fromValues(0, 1, 0),
      c = vec3.fromValues(0, 0, 0),
      d = vec3.fromValues(1, 2, 3);
  test.inDelta(geom.getAboveOrBelow(a, b, c, d), 1);
  test.end();
});

tape("Point Below: A(0, 0, 0), B(1, 0, 0), C(0, 0, 1) and D(1, 2, 3)", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.fromValues(1, 0, 0),
      c = vec3.fromValues(0, 0, 1),
      d = vec3.fromValues(1, 2, 3);
  test.inDelta(geom.getAboveOrBelow(a, b, c, d), -1);
  test.end();
});

tape("Point Below: A(1, 0, 0), B(-1, 0, 0), C(0, 1, 0) and D(1, 2, 3)", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.fromValues(-1, 0, 0),
      c = vec3.fromValues(0, 1, 0),
      d = vec3.fromValues(1, 2, 3);
  test.inDelta(geom.getAboveOrBelow(a, b, c, d), -1);
  test.end();
});

tape("Point Below: A(0, 0, 0), B(-1, 0, 0), C(0, 1, 0) and D(0, 0, 5)", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.fromValues(-1, 0, 0),
      c = vec3.fromValues(0, 1, 0),
      d = vec3.fromValues(0, 0, 5);
  test.inDelta(geom.getAboveOrBelow(a, b, c, d), -1);
  test.end();
});

tape("Point Above: A(1, 0, 0), B(0, 1, 0), C(1, 1, 0) and D(0, 0, -1)", function(test) {
  var a = vec3.fromValues(1, 0, 0),
      b = vec3.fromValues(0, 1, 0),
      c = vec3.fromValues(1, 1, 0),
      d = vec3.fromValues(0, 0, -1);
  test.inDelta(geom.getAboveOrBelow(a, b, c, d), 1);
  test.end();
});

tape("Point On: A(1, 0, 0), B(0, 1, 0), C(1, 1, 0) and D(0, 0, 0)", function(test) {
  var a = vec3.fromValues(1, 0, 0),
      b = vec3.fromValues(0, 1, 0),
      c = vec3.fromValues(1, 1, 0),
      d = vec3.fromValues(0, 0, 0);
  test.inDelta(geom.getAboveOrBelow(a, b, c, d), 0);
  test.end();
});

tape("Point On: A(1, 0, 0), B(0, 0, 1), C(0, 1, 0) and D(0.5, 0.5, 1)", function(test) {
  var a = vec3.fromValues(1, 0, 0),
      b = vec3.fromValues(0, 0, 1),
      c = vec3.fromValues(0, 1, 0),
      d = vec3.fromValues(0.5, 0.5, 0);
  test.inDelta(geom.getAboveOrBelow(a, b, c, d), 0);
  test.end();
});

tape("Degenerate triangle: A(1, 0, 0), B(0, 0, 1), C(0, 0, 1) and D(1, 1, 1)", function(test) {
  var a = vec3.fromValues(1, 0, 0),
      b = vec3.fromValues(0, 0, 1),
      c = vec3.fromValues(0, 0, 1),
      d = vec3.fromValues(1, 1, 1);
  test.equal(geom.getAboveOrBelow(a, b, c, d), undefined, "degenerate case, triangle has no area");
  test.end();
});

