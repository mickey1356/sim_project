class SimMap {
  constructor(nodes, entrance, rides) {
    this.nodes = nodes;
    this.entrance = entrance;
    this.rides = rides;
    this.edges = [];
  }

  connectNode(node1, node2) {
    const n1 = this.nodes[node1];
    const n2 = this.nodes[node2];
    n1.connect(n2);
    n2.connect(n1);

    const edge = [[n1.x, n1.y], [n2.x, n2.y]]
    this.edges.push(edge)
  }

  getPathToNode(startNode, targetNode) {

    let visited = new WeakMap();
    for (let node of this.nodes) {
      visited.set(node, false);
    }

    let queue = [];
    queue.push([startNode]);

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];
      visited.set(node, true);
      if (node === targetNode) {
        return path;
      }
      for (let next of node.connections) {
        if (visited.get(next)) continue;
        let npath = [];
        for (const pnode of path) npath.push(pnode);
        npath.push(next);
        queue.push(npath);
      }
    }
  }

  drawMap(surface, width, height) {
    const nSurface = surface.append("g").attr("id", "map");

    for (let i = 0; i < this.edges.length; i++) {
      this.edges[i][0][0] *= width;
      this.edges[i][0][1] *= height;
      this.edges[i][1][0] *= width;
      this.edges[i][1][1] *= height;
    }

    const edgeSurface = nSurface.selectAll("#map.mapEdges").data(this.edges);
    let newEdges = edgeSurface.enter().append("g").attr("class", "mapEdges");

    newEdges.append("path")
      .attr("d", (d) => d3.line()(d))
      .attr("stroke", "black")
      .attr("fill", "none");

    const mapSurface = nSurface.selectAll("#map.mapNodes").data(this.nodes);
    let newNodes = mapSurface.enter().append("g").attr("class", "mapNodes");

    // TODO: replace this with an image
    newNodes.append("circle")
      .attr("cx", (n) => n.x * width)
      .attr("cy", (n) => n.y * height)
      .attr("r", 5)
      .style("fill", (n) => n.fillColor);
    
    newNodes.append("svg:image")
      .attr("x", (n) => n.x * width)
      .attr("y", (n) => n.y * height)
      .attr("width", 10)
      .attr("height", 10)
      .attr("xlink:href", (n) => n.imgURL);
  }
}

class MapNode {
  constructor(type, x, y, imgURL) {
    // three types (entrance, ride, junction)
    this.type = type;

    // x and y positions stored as relative positions
    this.x = x;
    this.y = y;
    this.imgURL = imgURL;
    this.connections = [];

    this.fillColor = "black";
    if (this.type == "entrance") {
      this.fillColor = "red";
    } else if (this.type == "ride") {
      this.fillColor = "blue";
    }
  }

  // set some basic ride parameters
  // capacity: how many people can ride at one time
  // runtime: length of the ride (in terms of update cycles)
  // turnover: how long before the next set of people can ride (in terms of update cycles)
  // eg. if turnover == runtime => you only can have one set of riders at any one time
  setRideParameters(capacity, runtime, turnover) {
    this.capacity = capacity;
    this.runtime = runtime;
    this.turnover = turnover;

    // used to keep track on who is riding and who is queuing.
    this.ridingAgents = [];
    this.queue = [];

    // decrement these values in the update loop
    this.runCooldown = runtime;
    this.turnoverCooldown = turnover;
  }

  enqueue(agent) {
    this.queue.push(agent);
  }

  update() {
    // 
  }

  connect(other) {
    this.connections.push(other);
  }
}