var tape = require("tape"),
    fs = require('fs');
    require("./inDelta.js"),
    geom = require("../GeomPrimitives.js");

tape("Parallel lines A(0, 0), B(5, 7), C(4, 4), D(9, 11)", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.fromValues(4, 4, 0),
      c = vec3.fromValues(5, 7, 0),
      d = vec3.fromValues(9, 11, 0);
  test.notOk(geom.getLineSegmentIntersection(a, b, c, d), "Parallel lines with no intersection");
  test.end();
});

tape("Segments Coincide A(0, 0), B(5, 7), C(0, 0), D(10, 14)", function(test) {
  var a = vec3.fromValues(0, 0, 0),
      b = vec3.fromValues(5, 7, 0),
      c = vec3.fromValues(0, 0, 0),
      d = vec3.fromValues(10, 14, 0);
  test.notOk(geom.getLineSegmentIntersection(a, b, c, d), "Segments coincide, no unique intersection point");
  test.end();
});

