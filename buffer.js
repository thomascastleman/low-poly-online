
function createBufferFromImg(bgImg, scale=1) {
  // create graphics buffer with same ratio as image, scaled
  let g = createGraphics(scale * bgImg.width, scale * bgImg.height);

  // draw the background image to the buffer
  g.image(bgImg, 0, 0, scale * bgImg.width, scale * bgImg.height);

  return g;
}

// save a graphics buffer with a custom name
function saveBuffer(g) {
  let name = prompt('Please enter a file name', 'lowpoly')
  if (!name) name = 'lowpoly';
  save(g, name + '.png')
}