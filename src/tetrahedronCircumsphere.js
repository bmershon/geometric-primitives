import {getTriangleCircumcenter} from "./triangleCircumcenter";
import {getLineIntersection} from "./intersection";

//Purpose: Given four points on a 3D tetrahedron, compute the circumsphere
//by intersecting two perpendicular bisectors from two different triangles,
//and compute the radius of the circumsphere
//Inputs: a (vec3), b (vec3), c (vec3), d (vec3)
//Returns: On object of the form {circumcenter: vec3, R: float (radius)}
export function getTetrahedronCircumsphere(a, b, c, d) {
  var n1 = vec3.create(), n2 = vec3.create(),
      f = vec3.create(), h = vec3.create(),
      ab = vec3.create(), ac = vec3.create(),
      bc = vec3.create(), bd = vec3.create(),
      p, r;

  vec3.sub(ab, b, a);
  vec3.sub(ac, c, a);
  vec3.sub(bc, c, b);
  vec3.sub(bd, d, b);

  vec3.cross(n1, ab, ac);
  vec3.cross(n2, bc, bd);
  
  var e = getTriangleCircumcenter(a, b, c).Circumcenter;
  var g = getTriangleCircumcenter(b, c, d).Circumcenter;

  vec3.add(f, e, n1);
  vec3.add(h, g, n2);

  p = getLineIntersection(e, f, g, h, true);
  r = vec3.dist(a, p);

  return {Circumcenter: p, Radius: r};
}