
/*
    util.js: Utility functions
*/

// find squared difference between each color value of two adjacent pixels
// a :: Color, b :: Color -> Float
function gradient(a, b) {
  return pow(red(a) - red(b), 2) + pow(green(a) - green(b), 2) + pow(blue(a) - blue(b), 2);
}

// check if two vectors are equal
// v1 :: p5.Vector, v2 :: p5.Vector -> Boolean
function vecEq(v1, v2) {
  return (v1.x == v2.x) && (v1.y == v2.y);
}

// square components 
// v :: p5.Vector --> Float
function squareComponents(v) {
  return (v.x * v.x) + (v.y * v.y);
}

// check if two points p1 and p2 are on the same side of segment AB
// p1 :: p5.Vector, p2 :: p5.Vector, a :: p5.Vector, b :: p5.Vector -> Boolean
function sameSide(p1, p2, a, b) {
  let cp1 = b.copy().sub(a).cross(p1.copy().sub(a));
  let cp2 = b.copy().sub(a).cross(p2.copy().sub(a));
  
  return cp1.dot(cp2) >= 0;
}

// compute image showing energy values as grayscale image
// energies :: double[][] -> p5.Image
function visualEnergyMatrix(energies) {
  let e = createImage(energies.length, energies[0].length);
  e.loadPixels();
  for (let x = 0; x < e.width; x++) {
    for (let y = 0; y < e.height; y++) {
      e.set(x, y, color(map(energies[x][y], 0, 1, 0, 255)));
    }
  }
  e.updatePixels();
  return e
}

// map x, y coordinates onto the index in the pixels array of a given pixel (w is image width)
// x :: int, y :: int, w :: int
function pixelPosition(x, y, w) {
  return ((y * w) + x) * 4;
}

// get the color of a pixel in an image, efficiently using pixels array (pixels must be loaded!!)
// x :: int, y :: int, img :: p5.Image
function accessColor(x, y, img) {
  let i = pixelPosition(x, y, img.width)
  return color(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3])
}