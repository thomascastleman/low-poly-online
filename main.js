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
 
let img, bg;
 
function setup() {
  createCanvas(800, 600).drop(gotFile);
  //noStroke().fill(0xff).frameRate(10).noLoop();
  textSize(24).textAlign(CENTER).blendMode(REPLACE);
  bg = color(200);
}
 
function draw() {
  background(bg);
  if (img) {
    image(img, 0, 0, width, height);
  } else {
    text('Drag an image file onto the canvas.', width >> 1, height >> 1);
  }
}
 
function gotFile(f) {
  if (f.type === 'image') {
    img = loadImage(f.data, redraw);
  } else {
    alert(`"${f.name}" isn't an image file!`);
  }
}

/* ---------------------------------------------------------------- */

// let img;
// let canvas;
// let scaleFactor;

// function setup() {
//   resetCanvas(windowWidth, windowHeight)

//   input = createFileInput(handleFile);
//   input.position(0, 0);
// }

// function draw() {
//   background(255);
//   if (img) {
//     // ensure image fits on screen
//     scale(scaleFactor);

//     // display image on the canvas
//     image(img, 0, 0, img.width, img.height);
//   }
// }

// // handle a file upload
// function handleFile(file) {
//   if (file.type === 'image') {
//     img = createImg(file.data, '');
//     img.hide(); // hide the HTML image element (we want to draw it on our canvas)

//     // what factor will we need to scale by to fit on screen
//     scaleFactor = windowHeight / img.height;

//     // set the canvas to be the same size as the scaled image
//     resetCanvas(img.width * scaleFactor, img.height * scaleFactor)
//   } else {
//     img = null;
//   }
// }

// // reset the canvas to a given width and height
// function resetCanvas(w, h) {
//   if (canvas) canvas.remove();
//   canvas = createCanvas(w, h);
// 	canvas.position(0, 0);
//   canvas.style('z-index', '-1');
// }

// // save the current canvas
// function saveLowPoly() {
//   let name = prompt('Please enter a file name', 'lowpoly')
//   if (!name) name = 'lowpoly';
//   save(name + '.png')
// }