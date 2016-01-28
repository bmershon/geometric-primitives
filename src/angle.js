//Purpose: To compute the angle between the vectors ab and ac
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: angle (radians - float)
export function getAngle(a, b, c) {
  var ab = vec3.create(),
      ac = vec3.create();
  ab = vec3.sub(ab, b, a);
  ac = vec3.sub(ac, c, a);
  var r = vec3.dot(ab, ac)/(vec3.length(ab)*vec3.length(ac));
  return Math.acos(r);
}