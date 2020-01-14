
function createImageUploader() {
  let input = createFileInput(handleFile);
  
  // place it inside the fileInput div
  input.parent('fileInput');
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
      hideSave(); // prevent user from saving since they just uploaded a new image
      showGenerate(); // show the 'generate' button as now we can generate a low poly
      createPreview();  // create a preview of the uploaded image
    });
  } else {
    alert(`"${f.name}" isn't an image file!`);
  }
}