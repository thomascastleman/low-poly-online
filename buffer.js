
function createBuffer(scale) {
  // create graphics buffer with same ratio as image, scaled
  let g = createGraphics(scale * src.width, scale * src.height);

  // 
  g.image(src, 0, 0, scale * src.width, scale * src.height);
  return g;
}

// save the current canvas
function saveBuffer(g) {
  let name = prompt('Please enter a file name', 'lowpoly')
  if (!name) name = 'lowpoly';
  save(g, name + '.png')
}