
/*
    DelaunayTriangulation.js: Class to handle construction of Delaunay Triangulation on a point set
*/

class DelaunayTriangulation {
  // construct a Delaunay triangulation on a set of points
  // points :: List<p5.Vector>
  constructor(points) {
    this.triangles = [];

    // debug: logs
    console.log("Constructing Delaunay Triangulation... ");
    
    // get the bounding super triangle for this point set
    const superTriangle = this.getSuperTriangle(points);
    
    // add super triangle to triangulation
    this.triangles.push(superTriangle);

    let badTriangles = [];
    let polygon = [];
    
    // for each point
    for (let p = 0; p < points.length; p++) {
      let point = points[p];
      
      // reset bad triangles to empty
      badTriangles = [];
      
      // for each triangle in triangulation
      for (let ti = 0; ti < this.triangles.length; ti++) {
        let t = this.triangles[ti];

        // if point lies within triangle's circumcircle
        if (t.containsInCircumcircle(point)) {
          badTriangles.push(t);
          t.isBad = true;
        }
      }
      
      // reset polygon edges to empty
      polygon = [];
      
      // add non-shared edges of bad triangles to polygonal hole
      for (let i = 0; i < badTriangles.length; i++) {        
        let t = badTriangles[i];
        let edge, shared;
        
        for (let e = 0; e < 3; e++) {
          // assume edge not shared
          shared = false;
          
          if (e < 2) {
            // construct edge from each pair of vertices
            edge = new Edge(t.vertices[e], t.vertices[e + 1]);
          } else {
            // wrap around from vertex 2 to vertex 0
            edge = new Edge(t.vertices[e], t.vertices[0]);
          }
          
          // for all the other bad triangles
          badTriangleLoop:
          for (let j = 0; j < badTriangles.length; j++) {
            if (i != j) {
              let b = badTriangles[j];
              let otherEdge;

              // check edges of other bad triangle
              for (let e2 = 0; e2 < 3; e2++) {
                if (e2 < 2) {
                  // construct edge from each pair of vertices
                  otherEdge = new Edge(b.vertices[e2], b.vertices[e2 + 1]);
                } else {
                  // wrap around from vertex 2 to vertex 0
                  otherEdge = new Edge(b.vertices[e2], b.vertices[0]);
                }
                
                // if edge is shared between bad triangles, break
                if (edge.edgeEquals(otherEdge)) {
                  shared = true;
                  break badTriangleLoop;
                }
              }
            }
          }
          
          // if non-shared edge, add to polygon
          if (!shared) {
            polygon.push(edge);
          }
        }
      }

      // remove all triangles that are labeled 'bad'
      let onlyGood = [];
      for (let i = 0; i < this.triangles.length; i++) {
        if (!this.triangles[i].isBad) {
          onlyGood.push(this.triangles[i]);
        }
      }
      this.triangles = onlyGood;
      
      // for each edge in polygonal hole
      for (let i = 0; i < polygon.length; i++) {
        let e = polygon[i];
        // add new triangle between this edge and point
        this.triangles.push(new Triangle(point, e.v1, e.v2));
      }
    }

    const notConnectedToSuper = [];

    for (let i = 0; i < this.triangles.length; i++) {
      let t = this.triangles[i];

      let connected = false;

      // compare triangle vertices with super triangle vertices
      outer:
      for (let v = 0; v < t.vertices.length; v++) {
        for (let s = 0; s < superTriangle.vertices.length; s++) {
          // if share vertex, remove triangle
          if (t.vertices[v].x == superTriangle.vertices[s].x && t.vertices[v].y == superTriangle.vertices[s].y) {
            connected = true;
            break outer;
          }
        }
      }

      if (!connected) {
        notConnectedToSuper.push(t);
      }
    }

    /// ddeeeeebg 
    console.log(this.triangles);

    this.triangles = notConnectedToSuper;

    console.log("Done.");
  }
  
  // construct bounding triangle that contains all points in set
  // points :: List<p5.Vector> -> Triangle
  getSuperTriangle(points) {
    let xMin = 0, xMax = 0, yMin = 0, yMax = 0;
    
    // loop through points
    for (let i = 0; i < points.length; i++) {
      let p = points[i];
      
      // update mins and maxes accordingly
      if (i == 0 || p.x < xMin)
        xMin = p.x;
      if (i == 0 || p.x > xMax)
        xMax = p.x;
      if (i == 0 || p.y < yMin)
        yMin = p.y;
      if (i == 0 || p.y > yMax)
        yMax = p.y;
    }
    
    // add buffer to ensure all points are contained in super triangle
    xMin -= 1;
    yMin -= 1;
    xMax += 1;
    yMax += 1;
    
    // place vertices where they will encompass entire rectangular window of points
    const v1 = createVector((xMin + xMax) / 2.0, (2 * yMin) - yMax);
    const v2 = createVector(xMin - ((xMax - xMin) / 2.0), yMax);
    const v3 = createVector(xMax + ((xMax - xMin) / 2.0), yMax);
    
    return new Triangle(v1, v2, v3);
  }
  
  // display the triangulation in a given buffer
  display(buffer) {
    // display each individual triangle
    for (let i = 0; i < this.triangles.length; i++) {
      this.triangles[i].display(buffer);
    }
  }
  
}