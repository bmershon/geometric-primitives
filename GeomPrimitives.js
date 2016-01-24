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

"use strict";
// pollyfill: globally defined glm namespace for gl-matrix library
if(typeof window === 'undefined') {
    var glm = require('./gl-matrix-min.js');
    global.vec3 = glm.vec3;
}

var epsilon = 1e-3;

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

//Inputs: a (vec3), b (vec3), c (vec3), d (vec3)
//Returns: intersection (vec3) or null if no intersection
function getLineSegmentIntersection(a, b, c, d) {
    var ab = vec3.create(), cd = vec3.create(),
        p = vec3.create(), n = vec3.create();

    vec3.sub(ab, b, a);
    vec3.sub(cd, d, c);

    var s = solveParametricIntersection(a, ab, c, cd);
    if (!s) return null; 

    // check solution bounds
    if(s[0] < 0 || s[0] > 1 || s[1] < 0 || s[1] > 1) return null;

    vec3.scale(n, ab, s[0]);
    vec3.add(p, a, n);

    return p; // a + su
}

// point a extending in direction u, point b extending in direction v
// returns null if lines are parallel or skew
function solveParametricIntersection(a, u, b, v) {
    var ux = u[0], uy = u[1], uz = u[2],
        vx = -v[0], vy = -v[1], vz = -v[2],
        bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2],
        ab = vec3.create(), ba = vec3.create(),
        n1 = vec3.create(), n2 = vec3.create(),
        diff = vec3.create(),
        s, t;

    // two normals coincide if lines line in same plane
    vec3.sub(ab, b, a);
    vec3.sub(ba, a, b);
    vec3.cross(n1, u, ab);
    vec3.cross(n2, v, ba);
    vec3.cross(diff, n1, n2);

    if (!(inDelta(vec3.length(diff), 0.0))) return null;

    if(ux*vy - vx*uy !== 0) { // solve for x and y coordinates
        let denom = ux*vy - vx*uy;
        s = (bx*vy - vx*by)/(denom);
        t = (ux*by - bx*uy)/(denom);
        return [s, t];
    } else if (ux*vz - vx*uz !== 0) { // solve for x and z coordinates
        let denom = ux*vz - vx*uz;
        s = (bx*vz - vx*bz)/(denom);
        t = (ux*bz - bx*uz)/(denom);
        return [s, t];
    } else if (uy*vz - vy*uz !== 0) { // solve for y and z coordinates
        let denom = uy*vz - vy*uz;
        s = (by*vz - vy*bz)/(denom);
        t = (uy*bz - by*uz)/(denom);
        return [s, t];
    } else 
        return null; // lines are parallel or coincide
}

function getLineIntersection(a, b, c, d) {
    var ab = vec3.create(), cd = vec3.create(),
        p = vec3.create(), n = vec3.create(),
        s;

    vec3.sub(ab, b, a);
    vec3.sub(cd, d, c);

    s = solveParametricIntersection(a, ab, c, cd);
    if (!s) return null; 

    vec3.scale(n, ab, s[0]);
    vec3.add(p, a, n);

    return p;
}

// https://en.wikipedia.org/wiki/Circumscribed_circle
//Purpose: Given three points on a triangle abc, compute the triangle circumcenter
//by intersecting two perpendicular bisectors from two different sides, and
//compute the radius of the circumcircle
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: On object of the form {circumcenter: vec3, R: float (radius)}
function getTriangleCircumcenter(A, B, C) {
    var a = vec3.create(0), b = vec3.create(),
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

//Purpose: Given four points on a 3D tetrahedron, compute the circumsphere
//by intersecting two perpendicular bisectors from two different triangles,
//and compute the radius of the circumsphere
//Inputs: a (vec3), b (vec3), c (vec3), d (vec3)
//Returns: On object of the form {circumcenter: vec3, R: float (radius)}
function getTetrahedronCircumsphere(a, b, c, d) {
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

    p = getLineIntersection(e, f, g, h);
    r = vec3.dist(a, p);

    return {Circumcenter: p, Radius: r};
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
    var minval = 0;
    var maxval = 0;
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

function inDelta(actual, expected) {
    return actual < expected + epsilon && actual > expected - epsilon;
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