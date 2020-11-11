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

  // TODO: replace with APSP for constant lookups
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
      for (let npair of node.connections) {
        const next = npair[0];
        if (visited.get(next)) continue;
        let npath = [];
        for (const pnode of path) npath.push(pnode);
        npath.push(next);
        queue.push(npath);
      }
    }
  }

  drawMap() {
    // draw edges
    stroke(255);
    strokeWeight(1);
    for (const edge of this.edges) {
      line(edge[0][0], edge[0][1], edge[1][0], edge[1][1]);
    }

    // draw nodes
    stroke(0);
    strokeWeight(1);
    for (const node of this.nodes) {
      // fill(node.fill);
      // circle(node.x, node.y, 10);

      if (!(typeof node.img === "undefined" || node.img === null)) {
        image(node.img, node.x - ICON_WIDTH / 2, node.y - ICON_HEIGHT, ICON_WIDTH, ICON_HEIGHT);
      }
    }
  }
}

class MapNode {
  constructor(type, x, y, imgURL) {
    // three types (entrance, ride, junction)
    this.type = type;

    // x and y passed in as relative (converted to absolute)
    this.x = x * WIDTH;
    this.y = y * HEIGHT;
    this.connections = [];


    this.fill = "black";
    if (this.type == "entrance") {
      this.fill = "#a50";
      this.img = loadImage(ENTRANCE_IMG_PATH);
    } else if (this.type == "ride") {
      this.fill = "#0ab";
      this.img = loadImage(RIDE_IMG_PATH);
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
    this.connections.push([other, distance(this.x, this.y, other.x, other.y)]);
  }
}