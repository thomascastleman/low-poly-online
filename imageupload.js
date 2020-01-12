
function createImageUploader() {
  let input = createFileInput(handleFile);
  input.position(0, 0);
}


// when file has been uploaded
function handleFile(f) {
  if (f.type === 'image') {
    // update the cache of the original image
    original = loadImage(f.data, () => {

      // compute how much we'd have to scale down both images if they were side-by-side vs top-bottom
      topBottomScaleFactor = findFittingScale(original.width, 2 * original.height)
      sideBySideScaleFactor = findFittingScale(2 * original.width, original.height)

      if (topBottomScaleFactor > sideBySideScaleFactor) {
        preview = createGraphics(original.width, 2 * original.height)

        // choose top-bottom
        previewScale = topBottomScaleFactor;
        
        // position the low poly preview below the original image preview
        previewPositions = {
          original: { x: 0, y: 0 },
          lowPoly: { x: 0, y: original.height }
        }
      } else {
        preview = createGraphics(2 * original.width, original.height)

        // choose side-by-side
        previewScale = sideBySideScaleFactor;

        // position the low poly preview to the right of the original image preview
        previewPositions = {
          original: { x: 0, y: 0 },
          lowPoly: { x: original.width, y: 0 }
        }
      }

      lowPoly = createGraphics(original.width, original.height);
      lowPoly.background(0)

      // draw both the original and the low poly previews to the preview window
      preview.image(original, previewPositions.original.x, previewPositions.original.y)
      preview.image(lowPoly, previewPositions.lowPoly.x, previewPositions.lowPoly.y)

      // call draw again
      redraw();
    });
  } else {
    alert(`"${f.name}" isn't an image file!`);
  }
}