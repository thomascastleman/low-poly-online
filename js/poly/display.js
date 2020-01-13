
function showPointSet(set) {
  displayBuffer.push();
    displayBuffer.scale(params.outputScale);
    for (let i = 0; i < set.length; i++) {
      displayBuffer.ellipse(set[i].x, set[i].y, 5, 5);
    }
  displayBuffer.pop();
}