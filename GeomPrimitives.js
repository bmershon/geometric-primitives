/**
 *
 * MATH 209
 *
 * Modified from Chris Tralie's assignment template.
 * This is the engine behind the 3D primitive operations for Mini Assignment 1
 *
 * Implementations by Brooks Mershon
 *
 */

// pollyfill: globally defined glm namespace for gl-matrix library
if(typeof window === 'undefined') {
    var glm = require('./gl-matrix-min.js');
    vec3 = glm.vec3;
}

//Purpose: Project vector u onto vector v using the glMatrix library
//Inputs: u (vec3), v (vec3)
//Returns: projv (vec3), the projection of u onto v
function projVector(u, v) {
    var scale = (vec3.dot(u, v)/vec3.dot(v, v));//The scale in front of v is (u dot v) / (v dot v)
    var projv = vec3.create(); //Allocate a vector to hold the output
    vec3.scale(projv, v, scale); //Scale v by the appropriate amount
    return projv; //Return the result
}

//Purpose: To compute the perpendicular projection of a vector u onto a vector v
//Inputs: u (vec3), v (vec3)
//Returns: projperpv (vec3), the projection of u onto v
function projPerpVector(u, v) {
    var projv = projVector(u, v);
    var projperpv = vec3.create();
    vec3.subtract(projperpv, u, projv);
    return projperpv;
}

//Purpose: To compute the angle between the vectors ab and ac
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: angle (radians - float)
function getAngle(a, b, c) {
    var ab = vec3.create(),
        ac = vec3.create();
    ab = vec3.sub(ab, b, a);
    ac = vec3.sub(ac, c, a);
    var r = vec3.dot(ab, ac)/(vec3.length(ab)*vec3.length(ac));
    return Math.acos(r);
}


//Purpose: Given three 3D vertices a, b, and c, compute the area of the triangle
//spanned by them
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: area (float)
function getTriangleArea(a, b, c) {
    var out = vec3.create(),
        ab  = vec3.create(),
        ac  = vec3.create();
    ab = vec3.sub(ab, b, a);
    ac = vec3.sub(ac, c, a);
    out = vec3.cross(out, ab, ac);
    return Math.abs(vec3.length(out))/2.0; 
}

//Purpose: For a plane determined by the points a, b, and c, with the plane
//normal determined by those points in counter-clockwise order using the
//right hand rule, decide whether the point d is above, below, or on the plane
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: 1 if d is above, -1 if d is below, 0 if d is on
function getAboveOrBelow(a, b, c, d) {
    var norm = vec3.create(),
        ab  = vec3.create(),
        ac  = vec3.create(),
        cd  = vec3.create();
    ab = vec3.sub(ab, b, a);
    ac = vec3.sub(ac, c, a);
    vec3.cross(norm, ab, ac);
    if (vec3.length(norm) == 0) return undefined;
    vec3.sub(cd, d, c);
    dist = vec3.dot(norm, projVector(cd, norm));
    if(dist == 0) return 0;
    else return vec3.dot(norm, d) > 0 ? 1 : -1;
}

//Inputs: a (vec3), b (vec3), c (vec3), d (vec3)
//Returns: intersection (vec3) or null if no intersection
function getLineSegmentIntersection(a, b, c, d) {
    var ab = vec3.create(), cd = vec3.create();

    vec3.sub(ab, b, a);
    vec3.sub(cd, d, c);

    var s = solveParametricIntersection(a, ab, c, cd);
    if (!s) return null; 

    // check solution bounds
    if(s[0] < 0 || s[0] > 1 || s[1] < 0 || s[1] > 1) return null;

    var p = vec3.create();
    var n = vec3.create();
    vec3.scale(n, ab, s[0]);
    vec3.add(p, a, n);

    return p; // a + su
}

// point a extending in direction u, point b extending in direction v
// returns null if lines are skew or parallel
function solveParametricIntersection(a, u, b, v) {
    var ux = u[0], uy = u[1],
        vx = -v[0], vy = -v[1],
        bx = b[0] - a[0], by = b[1] - a[1],
        ab = vec3.create(), ba = vec3.create(),
        n1 = vec3.create(), n2 = vec3.create(),
        diff = vec3.create();

    vec3.sub(ab, b, a);
    vec3.sub(ba, a, b);
    vec3.cross(n1, u, ab);
    vec3.cross(n2, v, ba);
    vec3.cross(diff, n1, n2);

    if (vec3.length(diff) !== 0.0) return null;

    var denom = ux*vy - vx*uy;
    if(denom == 0.0) return null;

    var s = (bx*vy - vx*by)/(denom);
    var t = (ux*by - bx*uy)/(denom);

    return [s, t];
}

function getLineIntersection(a, b, c, d) {
    var ab = vec3.create(), cd = vec3.create();

    vec3.sub(ab, b, a);
    vec3.sub(cd, d, c);

    var s = solveParametricIntersection(a, ab, c, cd);
    if (!s) return null; 

    var p = vec3.create();
    var n = vec3.create();
    vec3.scale(n, ab, s[0]);
    vec3.add(p, a, n);

    return p;
}

//Purpose: Given three points on a triangle abc, compute the triangle circumcenter
//by intersecting two perpendicular bisectors from two different sides, and
//compute the radius of the circumcircle
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: On object of the form {circumcenter: vec3, R: float (radius)}
function getTriangleCircumcenter(a, b, c) {

    var ab = vec3.create(), ac = vec3.create(),
        u = vec3.create(), v = vec3.create(), // normals
        e = vec3.create(), f = vec3.create(), // midpoints
        g = vec3.create(), h = vec3.create(), // constructed endpoints
        _a = vec3.create(), _b = vec3.create(), _c = vec3.create();
        
    vec3.sub(ab, b, a);
    vec3.sub(ac, c, a);
    vec3.normalize(u, vec3.fromValues(-ab[1], ab[0], 0)); // rotate 90 degrees counter-clockwise
    vec3.normalize(v, vec3.fromValues(ac[1], -ac[0], 0)); // rotate 90 degrees clockwise
    vec3.scale(_a, a, 0.5);
    vec3.scale(_b, b, 0.5);
    vec3.scale(_c, c, 0.5);
    vec3.add(e, _a, _b); // convex combination of a and b
    vec3.add(g, _a, _c); // convex combinaton of a and c
    vec3.add(f, e, u); // endpoint f of ef
    vec3.add(h, g, v); // endpoint h of gh

    var p = getLineIntersection(e, f, g, h);
    var r = vec3.distance(b, p);

    return {Circumcenter: p, Radius: r}; 
}

//Purpose: Given four points on a 3D tetrahedron, compute the circumsphere
//by intersecting two perpendicular bisectors from two different triangles,
//and compute the radius of the circumsphere
//Inputs: a (vec3), b (vec3), c (vec3), d (vec3)
//Returns: On object of the form {circumcenter: vec3, R: float (radius)}
function getTetrahedronCircumsphere(a, b, c, d) {
    //EXTRA CREDIT
    return {Circumcenter:vec3.fromValues(0, 0, 0), Radius:0.0};
}

///////////////////////////////////////////////////////////////////
///********           Plotting Utilities                 *******///
///////////////////////////////////////////////////////////////////

//This is code that Chris Tralie has written in to help plot the results
//for help debugging.  Feel free to browse the code to see how plot.ly works
//and ask any questions on the forum

//This is the way I hack the axes to be equal
function getAxesEqual(vs) {
    //Determine the axis ranges
    minval = 0;
    maxval = 0;
    for (var i = 0; i < vs.length; i++) {
        for (var j = 0; j < 3; j++) {
            if (vs[i][j] < minval){ minval = vs[i][j]; }
            if (vs[i][j] > maxval){ maxval = vs[i][j]; }
        }
    }
    return {
    x:{ x: [minval, maxval], y: [0, 0], z: [0, 0],
      mode: 'lines', line: {color: '#000000', width: 1}, type: 'scatter3d', name:'xaxis'
    },
    y:{ x: [0, 0], y: [minval, maxval], z: [0, 0],
      mode: 'lines', line: {color: '#000000', width: 1}, type: 'scatter3d', name:'yaxis'
    },
    z:{ x: [0, 0], y: [0, 0], z: [minval, maxval],
      mode: 'lines', line: {color: '#000000', width: 1}, type: 'scatter3d', name:'zaxis'
    }};
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        X: evt.clientX - rect.left,
        Y: evt.clientY - rect.top
    };
}

//Node.js or browser? Expose methods for unit testing in Node environment
if (typeof window === 'undefined') {
  module.exports = {
    projVector: projVector,
    projPerpVector: projPerpVector,
    getAngle: getAngle,
    getAngle: getAngle,
    getTriangleArea: getTriangleArea,
    getAboveOrBelow: getAboveOrBelow,
    getLineSegmentIntersection: getLineSegmentIntersection,
    getLineIntersection: getLineIntersection,
    getTriangleCircumcenter: getTriangleCircumcenter,
    getTetrahedronCircumsphere: getTetrahedronCircumsphere,
    getAxesEqual: getAxesEqual,
    getMousePos: getMousePos
  };
}