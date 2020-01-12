"use strict";
 
let original,     // original uploaded source image
  lowPoly,        // graphics buffer holding low poly image
  preview;        // graphics buffer that holds both the original image and low poly **previews**

let previewPositions;

// scaling factors
let previewScale, outputScale = 1;
const PREVIEW_SCALE_REDUCE = 0.85;

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
  if (preview) {
    drawPreview(preview);
  }
}

function drawPreview(source) {
  // compute ACTUAL scaling factor
  let sc = PREVIEW_SCALE_REDUCE * previewScale;

  push();
    // move to center the image
    translate((width - (sc * source.width)) / 2, (height - (sc * source.height)) / 2);

    // ensure image fits on screen
    scale(sc);

    // draw the uploaded image
    image(source, 0, 0, source.width, source.height);
  pop();
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