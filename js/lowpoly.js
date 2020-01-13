
// update the low poly buffer to have the low poly image
function generateLowPoly() {
  // draw original image
  lowPoly.scale(params.outputScale);
  lowPoly.image(original, 0, 0)
}