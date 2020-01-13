
function showPointSet(set) {
  displayBuffer.push();
    displayBuffer.scale(params.outputScale);

    // draw source image as background
    displayBuffer.image(original, 0, 0);

    for (let i = 0; i < set.length; i++) {
      displayBuffer.ellipse(set[i].x, set[i].y, 5, 5);
    }
  displayBuffer.pop();
}