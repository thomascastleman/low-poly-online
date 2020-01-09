
function createImageUploader() {
  let input = createFileInput(handleFile);
  input.position(0, 0);
}

// what to do when a file has been uploaded
function handleFile(f) {
  if (f.type === 'image') {
    src = loadImage(f.data, () => {
      // what factor will we need to scale by to fit an image preview on screen
      previewScale = findFittingScale(src)

      // call draw again
      redraw();
    });
  } else {
    alert(`"${f.name}" isn't an image file!`);
  }
}

// find a scale factor that will fit an image preview on the screen
function findFittingScale(img) {
  // determine how much we need to scale to fit each dimension on the screen
  let scaleH = windowHeight / img.height;
  let scaleW = windowWidth / img.width;

  // take the more extreme 
  return min(scaleH, scaleW)
}