//Purpose: Given three points on a triangle abc, compute the triangle circumcenter
//by intersecting two perpendicular bisectors from two different sides, and
//compute the radius of the circumcircle
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: On object of the form {circumcenter: vec3, R: float (radius)}
export function getTriangleCircumcenter(A, B, C) {
  var a = vec3.create(), b = vec3.create(),
      _a_2,
      _b_2,
      _axb_2,
      axb = vec3.create(),
      t1 = vec3.create(), t2 = vec3.create(), t3 = vec3.create(),
      p = vec3.create(),
      r;

  vec3.sub(a, A, C);
  vec3.sub(b, B, C);
  vec3.cross(axb, a, b);
  _a_2 = vec3.length(a) * vec3.length(a);
  _b_2 = vec3.length(b) * vec3.length(b);
  _axb_2 = vec3.length(axb) * vec3.length(axb);

  vec3.scale(t1, b, _a_2);
  vec3.scale(t2, a, _b_2);
  vec3.sub(t3, t1, t2);
  vec3.cross(p, t3, axb);

  vec3.scale(p, p, 1/(2*_axb_2));

  vec3.add(p, p, C);
  r = vec3.dist(C, p);

  return {Circumcenter: p, Radius: r}; 
}