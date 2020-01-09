"use strict";
 
let c, src, previewScale;
const bg = 200;

function setup() {
  c = createCanvas(windowWidth, windowHeight);
	c.position(0, 0);
  c.style('z-index', '-1');
  background(bg);
  createImageUploader();
}

function draw() {
  background(bg);
  if (src) {
    // ensure image fits on screen
    scale(previewScale);

    // draw the uploaded image
    image(src, 0, 0, src.width, src.height);
  }
}

/*
  The plan:
    Upload image file
    Display a scaled down preview of the uploaded image (to verify correctness)
    Create a graphics buffer same size of image--this is what we will draw triangles to
      - or allow user to scale the size of the output relative to original image
    Copy the original image into the buffer
    Compute the low poly and write it to the buffer
    Display a preview of the buffer
    Allow user to tweak parameters & run again if necessary
    On save, download the BUFFER (full image size)
*/