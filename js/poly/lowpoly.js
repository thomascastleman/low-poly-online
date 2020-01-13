
let dt, blur, kernel, points;

// update the low poly buffer to have the low poly image
function generateLowPoly() {
  // initialize low poly graphics buffer
  lowPoly = createGraphics(params.outputScale * original.width, params.outputScale * original.height);

  // array for storing relative energy of each pixel
  const energies = zeroArray(original.width, original.height);

  // create a point set reflecting the energy of the src image
  points = generatePointSet(energies, original);

  console.log(points.length + " points in point set.");

  // compute blurred image
  kernel = getKernel(params.blurKernelSize);
  blur = boxBlur(original, kernel);

  // compute Delaunay triangulation on set of points placed on image
  dt = new DelaunayTriangulation(points);

  // add color to triangulation based on blurred image
  blurColorizeTriangulation(blur, dt);

  lowPoly.push();
    lowPoly.scale(params.outputScale);

    // display blurred image under low poly form to fill in any gaps
    //lowPoly.image(blur, 0, 0);
  lowPoly.pop();

  // display colored triangulation
  dt.display(lowPoly);
}

function zeroArray(w, h) {
  var a = [];
  for (let i = 0; i < w; i++) {
    a[i] = [];
    for (let j = 0; j < h; j++) {
      a[i][j] = 0;
    }
  }
  return a;
}

/*  Generate a set of points on an image based on dual gradient energy, 
    where more points are placed in areas of greater energy,
    and fewer in areas with less energy.
    Cache the relativized energy value of each pixel in an energies matrix.
    energies :: List<List<Float>>, img :: p5.Image -> List<p5.Vector> */
function generatePointSet(energies, img) {
  console.log("Generating point set... ");

  let maxEnergy = 0;  // maximum energy value for later relativization

  // loop through all fully surrounded (x,y) positions in image
  for (let x = 1; x < img.width - 1; x++) {
    for (let y = 1; y < img.height - 1; y++) {
      // get colors of neighboring pixels      
      let above = img.get(x, y - 1);
      let below = img.get(x, y + 1);
      let left = img.get(x - 1, y);
      let right = img.get(x + 1, y);

      // calculate total energy of this pixel by summing horizontal and vertical gradients
      let energy = gradient(left, right) + gradient(above, below);

      // temporarily store the energy value in matrix
      energies[x][y] = energy;

      // maintain the max energy
      if (energy > maxEnergy) {
        maxEnergy = energy;
      }
    }
  }

  // point set for triangulation
  const points = [];

  /*  interval (in px) at which points will be added to point set 
   around the border of the image. This forces the triangulation to
   (mostly) cover the entirety of the dimensions of the image */
  const borderPointInterval = floor(img.width / 9);

  // for each X position in image
  for (let x = 0; x < img.width; x++) {
    // at specified interval, add points on top & bottom borders of image
    if (x % borderPointInterval == 0) {
      points.push(createVector(x, 0));
      points.push(createVector(x, img.height - 1));
    }

    // for each Y position in image
    for (let y = 0; y < img.height; y++) {
      // at specified interval, add points on left & right borders of image
      if (y % borderPointInterval == 0 && x == 0 && y != 0 && y != img.height - 1) {
        points.push(createVector(0, y));
        points.push(createVector(img.width - 1, y));
      }

      /*  calculate probability for a point to be placed at this 
       pixel's position based on the energy at this pixel */
      let p = (energies[x][y] / maxEnergy) * params.detailFactor;

      // cache relative energy in energies matrix
      energies[x][y] /= maxEnergy;

      /*  choose probabilistically to add a point at this position or not,
       and don't ever place them at the border positions (could already exist there) */
      if (random() < p && x % borderPointInterval != 0 && y % borderPointInterval != 0) {
        points.push(createVector(x, y));
      }
    }
  }

  console.log("Done.");

  return points;
}

/*  Get an n x n kernel
    n :: int -> List<List<Float>> */
function getKernel(n) {
  const k = zeroArray(n, n)
  const sq = n * n;

  // build n x n kernel with values 1 / (n^2)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      k[i][j] = 1 / sq;
    }
  }

  return k;
}

/*  Compute a box blur of an image
    img :: p5.Image, kernel :: List<List<Float>> -> p5.Image */
function boxBlur(img, kernel) {
  console.log("Computing box blur of source image... ");

  const blur = createImage(img.width, img.height);

  // compute half size of kernel for indexing
  const halfK = floor(kernel.length / 2);

  img.loadPixels();
  blur.loadPixels();

  // iterate over pixels
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let sumR = 0, sumG = 0, sumB = 0;

      // for each position in the kernel
      for (let ky = -halfK; ky <= halfK; ky++) {
        for (let kx = -halfK; kx <= halfK; kx++) {
          // if position valid (not outside image)
          if (y + ky >= 0 && x + kx >= 0 && y + ky < img.height && x + kx < img.width) {          
            // calculate position of actual pixel in pixels array
            let pos = (y + ky) * img.width + (x + kx);

            // add kernel-scaled color values to their respective sums
            sumR += kernel[ky + halfK][kx + halfK] * red(img.pixels[pos]);
            sumG += kernel[ky + halfK][kx + halfK] * green(img.pixels[pos]);
            sumB += kernel[ky + halfK][kx + halfK] * blue(img.pixels[pos]);
          }
        }
      }

      // in blurred image, set pixel color based on kernel sums
      //blur.pixels[y * img.width + x] = color(sumR, sumG, sumB);
      blur.set(x, y, color(sumR, sumG, sumB));
    }
  }

  // apply changes to pixels in blurred image
  blur.updatePixels();

  console.log("Done.");

  return blur;
}

/*  Use the blur of the source image to colorize each triangle by taking
    the color of the pixel located at the centroid of each triangle. 
    (Credit to Johnny Lindbergh)
    blur :: p5.Image, dt :: DelaunayTriangulation -> void */
function blurColorizeTriangulation(blur, dt) {
  console.log("Colorizing triangulation (blur method)... ");

  // for each triangle in triangulation
  for (let i = 0; i < dt.triangles.length; i++) {
    let t = dt.triangles[i];

    // compute centroid
    const cx = floor((t.v1.x + t.v2.x + t.v3.x) / 3.0);
    const cy = floor((t.v1.y + t.v2.y + t.v3.y) / 3.0);

    // get color of pixel at centroid
    const c = blur.get(cx, cy);

    // set triangle color
    t.r = red(c);
    t.g = green(c);
    t.b = blue(c);
  }

  console.log("Done.");
}
