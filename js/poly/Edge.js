
/*
    Edge.js: Class to store information about a polygon edge
*/

class Edge {
  // construct new Edge by copying vertex vectors
  // p1 :: p5.Vector, p2 :: p5.Vector
  constructor(p1, p2) {
    this.v1 = p1.copy();
    this.v2 = p2.copy();
  }
  
  // check if two edges describes the same pair of points
  // other :: Edge -> Boolean
  edgeEquals(other) {
    return (vecEq(this.v1, other.v1) && vecEq(this.v2, other.v2)) || (vecEq(this.v1, other.v2) && vecEq(this.v2, other.v1));
  }
  
}