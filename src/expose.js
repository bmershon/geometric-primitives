
// expose module to global namespace
for (var property in gl_geom) {
  window[property] = gl_geom[property];
}