let img;
let canvas;
let scaleFactor;

function setup() {
  resetCanvas(windowWidth, windowHeight)

  input = createFileInput(handleFile);
  input.position(0, 0);
}

function draw() {
  background(255);
  if (img) {
    // ensure image fits on screen
    scale(scaleFactor);

    // display image
    image(img, 0, 0, img.width, img.height);
  }
}

// handle a file upload
function handleFile(file) {
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();

    // what factor will we need to scale by to fit on screen
    scaleFactor = windowHeight / img.height;

    // set the canvas to be the same size as the scaled image
    resetCanvas(img.width * scaleFactor, img.height * scaleFactor)
  } else {
    img = null;
  }
}

// reset the canvas to a given width and height
function resetCanvas(w, h) {
  if (canvas) canvas.remove();
  canvas = createCanvas(w, h);
	canvas.position(0, 0);
  canvas.style('z-index', '-1');
}

// save the current canvas
function saveLowPoly() {
  let name = prompt('Please enter a file name', 'lowpoly')
  if (!name) name = 'lowpoly';
  save(name + '.png')
}