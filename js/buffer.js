
// save a graphics buffer with a custom name
function saveBuffer(g) {
  let name = prompt('Please enter a file name', `${uploadName}_lowpoly.png`)

  if (!name) {
    return;
  }

  save(g, name)
}

// prep the preview object, and create the lowPoly buffer
function createPreview() {
  // compute how much we'd have to scale down both images if they were side-by-side vs top-bottom
  const topBottomScaleFactor = findFittingScale(original.width, 2 * original.height)
  const sideBySideScaleFactor = findFittingScale(2 * original.width, original.height)

  if (topBottomScaleFactor > sideBySideScaleFactor) {
    preview.buffer = createGraphics(original.width, 2 * original.height)

    // choose top-bottom
    preview.scale = topBottomScaleFactor;
    
    // position the low poly preview below the original image preview
    preview.positions = {
      original: { x: 0, y: 0 },
      lowPoly: { x: 0, y: original.height }
    }
  } else {
    preview.buffer = createGraphics(2 * original.width, original.height)

    // choose side-by-side
    preview.scale = sideBySideScaleFactor;

    // position the low poly preview to the right of the original image preview
    preview.positions = {
      original: { x: 0, y: 0 },
      lowPoly: { x: original.width, y: 0 }
    }
  }

  // create the low poly buffer, scaled as desired
  lowPoly = createGraphics(params.outputScale * original.width, params.outputScale * original.height);
  lowPoly.background(255)

  updatePreview();
}

// redraw both the original and low poly images to the preview buffer
function updatePreview() {
  // draw the original image to the preview buffer
  preview.buffer.image(original, preview.positions.original.x, preview.positions.original.y)

  // draw the low poly to the preview buffer, scaling appropriately
  preview.buffer.push()
  preview.buffer.translate(preview.positions.lowPoly.x, preview.positions.lowPoly.y)
  preview.buffer.scale(1 / params.outputScale)
  preview.buffer.image(lowPoly, 0, 0)
  preview.buffer.pop();
}