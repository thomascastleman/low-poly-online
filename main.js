/**
 * Image Drop (v2.1)
 * GoToLoop (2015-Nov-25)
 *
 * forum.Processing.org/two/discussion/13650/
 * dropped-image-not-showing-in-the-draw-loop-gotfile-createimg-image#Item_4
 *
 * p5js.SketchPad.cc/sp/pad/view/ro.CYTkHWj9smgw8Q/latest
 */
 
"use strict";
 
let src, bg, scaleFactor, c;

function setup() {
  resetCanvas(windowWidth, windowHeight)
  c.drop(gotFile);
  textSize(24).textAlign(CENTER).blendMode(REPLACE);
}

function draw() {
  if (src) {
    // ensure image fits on screen
    scale(scaleFactor);

    // draw the uploaded image
    image(src, 0, 0, src.width, src.height);
  } else {
    text('Drag an image file onto the canvas.', width >> 1, height >> 1);
  }
}

// what to do when a file has been dropped on the canvas
function gotFile(f) {
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

// reset the canvas to a given width and height
function resetCanvas(w, h) {
  if (c) c.remove();
  c = createCanvas(w, h);
	c.position(0, 50);
  c.style('z-index', '1');
}

// save the current canvas
function saveLowPoly() {
  let name = prompt('Please enter a file name', 'lowpoly')
  if (!name) name = 'lowpoly';
  save(name + '.png')
}