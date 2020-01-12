"use strict";
 
let original,     // original uploaded source image
  lowPoly;        // graphics buffer holding low poly image

let preview = {
  buffer: null,     // graphics buffer holding preview content (original and low poly previews)
  scale: null,      // how to scale the total preview window to fit on screen
  positions: null   // the positions of the original / low poly images within the preview (side-by-side vs top-bottom)
}

// user-determined parameters for the low poly output
let params = {
  outputScale: 1,
  detailFactor: 0.11
}

const PREVIEW_SCALE_REDUCE = 0.85;  // how much to scale down the preview window from the window dimensions (not full screen)
const BG = 200; // background color

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.position(0, 0);
  c.style('z-index', '-1');
  background(BG);
  createImageUploader();
}

function draw() {
  background(BG);
  if (preview.buffer) {
    drawPreview(preview.buffer, preview.scale);
  }
}

function drawPreview(source, scaleFactor) {
  // compute ACTUAL scaling factor
  let sc = PREVIEW_SCALE_REDUCE * scaleFactor;

  push();
    // move to center the image
    translate((width - (sc * source.width)) / 2, (height - (sc * source.height)) / 2);

    // ensure image fits on screen
    scale(sc);

    // draw the uploaded image
    image(source, 0, 0, source.width, source.height);
  pop();
}

// recompute and display a low poly
function updateLowPoly() {
  generateLowPoly();  // compute a new low poly
  updatePreview();    // display it in the preview
}

function saveLowPoly() {
  saveBuffer(lowPoly);
}

// find a scale factor that will fit an image/graphics preview on the screen
function findFittingScale(w, h) {
  // determine how much we need to scale to fit each dimension on the screen
  let scaleH = height / h;
  let scaleW = width / w;

  // take the more extreme so we guarantee everything is shown
  return min(scaleH, scaleW)
}

/*
  The plan:
    Upload image file
    Display a scaled down preview of the uploaded image (to verify correctness)
    Create a graphics buffer same size of image--this is what we will draw triangles to
      - or allow user to scale the size of the output relative to original image
    Copy the original image into the buffer
    Compute the low poly and write it to the buffer
    Display a preview of the buffer (alongside the preview of the original)
    Allow user to tweak parameters & run again if necessary
    On save, download the BUFFER (full image size)
*/