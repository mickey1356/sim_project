class SimMap {
  constructor(nodes, connections) {
    this.nodes = nodes;
    this.entrance = nodes.filter((node) => node.type == "entrance")[0];
    this.rides = nodes.filter((node) => node.type == "ride");
    this.edges = [];
    for (let connect of connections) {
      this.connectNode(connect[0], connect[1]);
    }
  }

  checkMap() {
    // regenerate entrance and ride lists
    const entrances = nodes.filter((node) => node.type == "entrance");
    this.rides = nodes.filter((node) => node.type == "ride");

    // check only 1 entrance
    if (entrances.length != 1) {
      return false;
    }
    this.entrance = entrances[0];

    // check that entrance reaches all nodes
    for (let node of this.rides) {
      const p = this.getPathToNode(this.entrance, node);
      if (p == null) return false;
    }

    return true;
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
    return null;
  }

  updateRides() {
    for (let ride of this.rides) {
      ride.update();
    }
  }

  drawMap(creatorMode) {
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

      if (creatorMode) {
        fill(node.fill);
        circle(node.x, node.y, NODE_RADIUS);
      } else {
        if (!(typeof node.img === "undefined" || node.img === null)) {
          image(node.img, node.x - ICON_WIDTH / 2, node.y - ICON_HEIGHT, ICON_WIDTH, ICON_HEIGHT);
        }
      }
    }
  }

  addNode(node) {
    nodes.push(node);
  }

}

class MapNode {
  constructor(type, x, y) {
    // three types (entrance, ride, junction)
    this.type = type;
    this.typeIndex = NODE_TYPES.findIndex(t => t === this.type);

    // x and y passed in as relative (converted to absolute)
    this.x = x * WIDTH;
    this.y = y * HEIGHT;
    this.connections = [];

    this.setTypePars();
  }

  setTypePars() {
    this.fill = "black";
    this.img = null;
    if (this.type == "entrance") {
      this.fill = "#a50";
      this.img = loadImage(ENTRANCE_IMG_PATH);
    } else if (this.type == "ride") {
      this.fill = "#0ab";
      this.img = loadImage(RIDE_IMG_PATH);

      // if this is a ride, just choose random values for the ride parameters
      // possible TODO: allow for editing of these parameterss
      this.setRideParameters(getRandomCapacity(), getRandomRuntime(), getRandomTurnover());
    }
  }

  reset() {
    // reset the queue, cooldowns, riding agents
    this.queue = new PriorityQueue((a, b) => a[0] > b[0]);
    this.ridingAgents = [];
    this.runCooldowns = [];
    this.turnoverCooldown = 0;
    
    // should we rng the parameters again?
  }

  getType() {
    return this.type;
  }

  getDisplayInfo() {
    let displayInfo = `Capacity: ${this.capacity}\nRuntime: ${this.runtime}\nTurnover: ${this.turnover}\nPeople in queue: ${this.queue.size()}`;
    return displayInfo;
  }

  toggleType() {
    this.typeIndex = (this.typeIndex + 1) % NODE_TYPES.length;
    this.type = NODE_TYPES[this.typeIndex];
    this.setTypePars();
  }

  // set some basic ride parameters
  // capacity: how many people can ride at one time
  // runtime: length of the ride (in terms of update cycles)
  // turnover: how long before the next set of people can ride (in terms of update cycles)
  // eg. if turnover == runtime => you only can have one set of riders at any one time
  // eg. if turnover < runtime => you can have multiple set of riders at any one time
  // eg. if turnover > runtime => there is "resting period" between consecutive rides
  setRideParameters(capacity, runtime, turnover) {
    this.capacity = capacity;
    this.runtime = runtime;
    this.turnover = turnover;

    // used to keep track on who is riding and who is queuing.
    this.ridingAgents = [];
    this.queue = new PriorityQueue((a, b) => a[0]> b[0]);

    // decrement these values in the update loop
    this.runCooldowns = [];
    this.turnoverCooldown = 0;
  }

  enqueue(agent, priority) {
    this.queue.push([priority, agent]);
    agent.startQueueing();
  }

  update() {
    // if my turnovercooldown is not ready, update it
    if (this.turnoverCooldown > 0) {
      this.turnoverCooldown = max(0, this.turnoverCooldown - deltaTime / 1000);
    }

    // if there is people in the queue and i am ready to receive riders
    if (!this.queue.isEmpty() && this.turnoverCooldown <= 0) {
      // reset the turnoverCooldown
      this.turnoverCooldown = this.turnover;
      let agents = [];
      for (let i = 0; i < min(this.capacity, this.queue.size()); i++) {
        const agt = this.queue.pop()[1];
        agt.startRiding();
        agents.push(agt);
      }
      this.ridingAgents.push(agents);
      this.runCooldowns.push(this.runtime);
    }

    // if there are people riding, update my ridecooldowns
    if (this.runCooldowns.length > 0) {
      let dones = 0;
      for (let i = 0; i < this.runCooldowns.length; i++) {
        this.runCooldowns[i] -= deltaTime / 1000;
        if (this.runCooldowns[i] <= 0) {
          // this means the run is over
          dones += 1;
          for (const agt of this.ridingAgents[i]) {
            agt.doneRiding();
          }
        }
      }
      // if there are rides that are complete, clear the arrays
      this.runCooldowns.splice(0, dones);
      this.ridingAgents.splice(0, dones);
    }
  }

  connect(other) {
    this.connections.push([other, dist(this.x, this.y, other.x, other.y)]);
  }
}