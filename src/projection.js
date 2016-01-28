//Purpose: Project vector u onto vector v using the glMatrix library
//Inputs: u (vec3), v (vec3)
//Returns: projv (vec3), the projection of u onto v
export function projVector(u, v) {
  var scale = (vec3.dot(u, v)/vec3.dot(v, v));//The scale in front of v is (u dot v) / (v dot v)
  var projv = vec3.create(); //Allocate a vector to hold the output
  vec3.scale(projv, v, scale); //Scale v by the appropriate amount
  return projv; //Return the result
}

//Purpose: To compute the perpendicular projection of a vector u onto a vector v
//Inputs: u (vec3), v (vec3)
//Returns: projperpv (vec3), the projection of u onto v
export function projPerpVector(u, v) {
  var projv = projVector(u, v);
  var projperpv = vec3.create();
  vec3.subtract(projperpv, u, projv);
  return projperpv;
}