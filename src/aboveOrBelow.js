import {projVector} from "./projection";

//Purpose: For a plane determined by the points a, b, and c, with the plane
//normal determined by those points in counter-clockwise order using the
//right hand rule, decide whether the point d is above, below, or on the plane
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: 1 if d is above, -1 if d is below, 0 if d is on
export function getAboveOrBelow(a, b, c, d) {
  var norm = vec3.create(),
      ab  = vec3.create(),
      ac  = vec3.create(),
      cd  = vec3.create(),
      dist;

  ab = vec3.sub(ab, b, a);
  ac = vec3.sub(ac, c, a);
  vec3.cross(norm, ab, ac);
  if (vec3.length(norm) == 0) return undefined;
  vec3.sub(cd, d, c);
  dist = vec3.dot(norm, projVector(cd, norm));
  if(dist == 0) return 0;
  else return vec3.dot(norm, d) > 0 ? 1 : -1;
}