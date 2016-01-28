var epsilon = 1e-6;

export function getLineIntersection(a, b, c, d, force) {
  force = force || false;

  var ab = vec3.create(), cd = vec3.create(),
      u = vec3.create(), v = vec3.create(),
      p = vec3.create(), n = vec3.create(),
      s;

  vec3.sub(ab, b, a);
  vec3.sub(cd, d, c);
  vec3.normalize(u, ab);
  vec3.normalize(v, cd);
  vec3.cross(n, u, v);

  if (!force && !inDelta(vec3.length(n), 0)) return null;

  s = solveParametricIntersection(a, ab, c, cd);

  if (!s) return null; 

  vec3.scale(n, ab, s[0]);
  vec3.add(p, a, n);

  return p;
}

// point a extending in direction u, point b extending in direction v
// returns null if lines are parallel or skew
function solveParametricIntersection(a, u, b, v) {
  var ux = u[0], uy = u[1], uz = u[2],
      vx = -v[0], vy = -v[1], vz = -v[2],
      bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2],
      s, t;

  var denom;

  if(ux*vy - vx*uy !== 0) { // solve for x and y coordinates
      denom = ux*vy - vx*uy;
      s = (bx*vy - vx*by)/(denom);
      t = (ux*by - bx*uy)/(denom);
      return [s, t];
  } else if (ux*vz - vx*uz !== 0) { // solve for x and z coordinates
      denom = ux*vz - vx*uz;
      s = (bx*vz - vx*bz)/(denom);
      t = (ux*bz - bx*uz)/(denom);
      return [s, t];
  } else if (uy*vz - vy*uz !== 0) { // solve for y and z coordinates
      denom = uy*vz - vy*uz;
      s = (by*vz - vy*bz)/(denom);
      t = (uy*bz - by*uz)/(denom);
      return [s, t];
  } else 
      return null; // lines are parallel or coincide
}


//Inputs: a (vec3), b (vec3), c (vec3), d (vec3)
//Returns: intersection (vec3) or null if no intersection
export function getLineSegmentIntersection(a, b, c, d, force) {
  force = force || false;

  var ab = vec3.create(), cd = vec3.create(),
      u = vec3.create(), v = vec3.create(),
      p = vec3.create(), n = vec3.create(),
      s;

  vec3.sub(ab, b, a);
  vec3.sub(cd, d, c);
  vec3.normalize(u, ab);
  vec3.normalize(v, cd);
  vec3.cross(n, u, v);

  if (!force && !inDelta(vec3.length(n), 0)) return null;

  s = solveParametricIntersection(a, ab, c, cd);

  if (!s) return null; 

  // check solution bounds
  if(s[0] < 0 || s[0] > 1 || s[1] < 0 || s[1] > 1) return null;

  vec3.scale(n, ab, s[0]);
  vec3.add(p, a, n);

  return p; // a + su
}

function inDelta(actual, expected) {
  return actual < expected + epsilon && actual > expected - epsilon;
}