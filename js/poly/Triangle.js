
/*
    Triangle.js: Class to handle triangle information and functionality related to Delaunay triangulations
*/

class Triangle {  
  // p1 :: p5.Vector, p2 :: p5.Vector, p3 :: p5.Vector
  constructor(p1, p2, p3) {
    this.v1 = p1.copy();
    this.v2 = p2.copy();
    this.v3 = p3.copy();
    this.vertices = [this.v1, this.v2, this.v3];
    this.numPixels = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
  }
  
  // check if point within circumcircle of this triangle
  // p :: p5.Vector -> Boolean
  containsInCircumcircle(p) {
      const ab = squareComponents(this.v1);
      const cd = squareComponents(this.v2);
      const ef = squareComponents(this.v3);
      
      const circumX = (ab * (this.v3.y - this.v2.y) + cd * (this.v1.y - this.v3.y) + ef * (this.v2.y - this.v1.y)) / (this.v1.x * (this.v3.y - this.v2.y) + this.v2.x * (this.v1.y - this.v3.y) + this.v3.x * (this.v2.y - this.v1.y));
      const circumY = (ab * (this.v3.x - this.v2.x) + cd * (this.v1.x - this.v3.x) + ef * (this.v2.x - this.v1.x)) / (this.v1.y * (this.v3.x - this.v2.x) + this.v2.y * (this.v1.x - this.v3.x) + this.v3.y * (this.v2.x - this.v1.x));
    
      const circum = createVector(0.5 * circumX, 0.5 * circumY);
      
      // calc radius of circumcircle and distance of point from circumcircle center
      const circumRadius = this.v1.dist(circum);
      const pointDist = p.dist(circum);
      
      // if point within circumcircle radius, return true
      return pointDist <= circumRadius;
  }
  
  // check if a point is inside this triangle (coloring)
  // p :: p5.Vector -> Boolean
  contains(p) {
    return sameSide(p, this.v1, this.v2, this.v3) && sameSide(p, this.v2, this.v1, this.v3) && sameSide(p, this.v3, this.v1, this.v2);    
  }
  
  // calculate and return the area of this triangle
  // void -> Float
  area() {
    // if area undefined, calculate & cache
    if (!this.area) {
      this.area = (((this.v1.x * (this.v2.y - this.v3.y)) + (this.v2.x * (this.v3.y - this.v1.y)) + (this.v3.x * (this.v1.y - this.v2.y)))) / 2.0;
      
      // correct for negativity
      if (this.area < 0) {
        this.area *= -1;
      }
    }
    
    return this.area;
  }
  
  // update the average color of pixels within this triangle
  // r :: int, g :: int, b :: int -> void
  updateAvgColor(r, g, b) {
    // re-average each color value
    this.r = (this.r * this.numPixels + r) / (this.numPixels + 1);
    this.g = (this.g * this.numPixels + g) / (this.numPixels + 1);
    this.b = (this.b * this.numPixels + b) / (this.numPixels + 1);
    
    // increment the number of pixels contributing to this average
    this.numPixels++;
  }
  
  // display a triangle in a given buffer
  // buffer :: p5.Graphics -> void
  display(buffer) {
    buffer.noStroke();
    buffer.fill(this.r, this.g, this.b);
    buffer.triangle(this.v1.x, this.v1.y, this.v2.x, this.v2.y, this.v3.x, this.v3.y);
  }
}