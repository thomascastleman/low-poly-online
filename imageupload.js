
function imgUploader() {
  let input = createFileInput(handleFile);
  input.position(0, 0);
}

// what to do when a file has been uploaded
function handleFile(f) {
  if (f.type === 'image') {
    src = loadImage(f.data, () => {
      // what factor will we need to scale by to fit on screen
      scaleFactor = windowHeight / src.height;

      // set the canvas to be the same size as the scaled image
      resetCanvas(src.width * scaleFactor, src.height * scaleFactor)
      
      // call draw again
      redraw();
    });
  } else {
    alert(`"${f.name}" isn't an image file!`);
  }
}