"use strict";
 
let original,     // original uploaded source image
  lowPoly;        // graphics buffer holding low poly image

let displayBuffer;  // graphics buffer for temporary, intermediate visualizations of the low poly process

let preview = {
  buffer: null,     // graphics buffer holding preview content (original and low poly previews)
  scale: null,      // how to scale the total preview window to fit on screen
  positions: null   // the positions of the original / low poly images within the preview (side-by-side vs top-bottom)
}

// user-determined parameters for the low poly output
let params = {
  /*  Factor by which to scale the dimensions of the output low poly image. Since the 
      resolution of the low poly output is independent of the dimensions of the original
      image, we can resize the output however we want and it will still look sharp.
      For this reason, I call low poly the French toast of image processing. */
  outputScale: 1,

  /*  Float in [0, 1] indicating the frequency at which a pixel, if it is chosen probabilistically 
      to have a point based on its energy, will actually get a point. Higher detail factor means more,
      smaller triangles and therefore greater approximation of the source image--but also higher 
      computing time. */
  detailFactor: 0.11,

  /*  Size of the kernel used in the box blur of the original image for coloring. The greater the kernel size,
      the more intense the blur, meaning colors are more likely to be similar & fluid between neighboring 
      triangles. */
  blurKernelSize: 21
}

let uploadName; // name of the image file uploaded
const PREVIEW_SCALE_REDUCE = 0.85;  // how much to scale down the preview window from the window dimensions (not full screen)
const BORDER_POINTS_ON_WIDTH = 13; // how many points will be placed across the width of the image on its borders
const BG = 40; // background color

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
  if (original) {
    // pull parameters from user input
    updateParams();

    // if all parameters are defined
    if (params.outputScale && params.detailFactor && params.blurKernelSize) {
      lowPoly = generateLowPoly();  // compute a new low poly
      updatePreview(original, lowPoly);    // display it in the preview
    } else {
      alert('Not all parameters were defined!');
    }
  }
}

// save the low poly image to your computer
function saveLowPoly() {
  if (lowPoly)
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