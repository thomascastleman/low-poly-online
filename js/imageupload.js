
function createImageUploader() {
  let input = createFileInput(handleFile);
  input.position(0, 0);
}


// when file has been uploaded
function handleFile(f) {
  if (f.type === 'image') {
    original = null;
    lowPoly = null;
    preview = {};
    resetOutputScale();

    // remove file ext to get original name
    uploadName = f.name.replace(/\..*/g, '')
    
    // update the cache of the original image
    original = loadImage(f.data, () => {

      createPreview();

      // call draw again
      redraw();
    });
  } else {
    alert(`"${f.name}" isn't an image file!`);
  }
}