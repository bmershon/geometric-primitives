//Purpose: Given three 3D vertices a, b, and c, compute the area of the triangle
//spanned by them
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: area (float)
export function getTriangleArea(a, b, c) {
  var out = vec3.create(),
      ab  = vec3.create(),
      ac  = vec3.create();
  ab = vec3.sub(ab, b, a);
  ac = vec3.sub(ac, c, a);
  out = vec3.cross(out, ab, ac);
  return Math.abs(vec3.length(out))/2.0; 
}