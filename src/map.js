class SimMap {
  constructor(nodes, connections) {
    this.nodes = nodes;
    this.entrance = nodes.filter((node) => node.type == "entrance")[0];
    this.rides = nodes.filter((node) => node.type == "ride");
    this.edges = [];
    for (let connect of connections) {
      this.connectNode(connect[0], connect[1]);
    }

    // set the rideIDs
    for (let i = 0; i < this.rides.length; i++) {
      this.rides[i].setRideName(i+1);
    }

    // run floyd warshall for setup()
    this.floydWarshall();
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

    // set the rideIDs
    for (let i = 0; i < this.rides.length; i++) {
      this.rides[i].setRideName(i+1);
    }

    // run floyd warshall for setup
    this.floydWarshall();

    return true;
  }

  connectNode(node1, node2) {
    const n1 = this.nodes[node1];
    const n2 = this.nodes[node2];
    n1.connect(n2);
    n2.connect(n1);

    const edge = [[n1.x, n1.y], [n2.x, n2.y]];
    this.edges.push(edge);
  }

  // taken from the pseudocode in wikipedia: https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
  floydWarshall() {
    const N = this.nodes.length;
    let dist = [];
    this.next = [];
    let i = 0;

    for (i = 0; i < N; i++) {
      let tDist = [];
      let tNext = [];
      for (let j = 0; j < N; j++) {
        tDist.push(Infinity);
        tNext.push(null);
      }
      dist.push(tDist);
      this.next.push(tNext);
    }

    for (i = 0; i < N; i++) {
      for (let edge of this.nodes[i].connections) {
        for (let j = 0; j < N; j++) {
          if (this.nodes[j] === edge[0]) {
            dist[i][j] = edge[1];
            this.next[i][j] = j;
            break;
          }
        }
      }
    }
    for (i = 0; i < N; i++) {
      dist[i][i] = 0;
      this.next[i][i] = i;
    }
    for (let k = 0; k < N; k++) {
      for (i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            this.next[i][j] = this.next[i][k];
          }
        }
      }
    }
    console.log("fw done");
  }

  // unfortunately, not O(1) time, but O(n) due to path reconstruction on the fly
  // but, this is faster than BFS and has distance-based traversal
  // although, it doesn't seem to have any noticeable difference?
  getPathToNode(startNode, targetNode) {
    // have to search for the indices, unfortunately
    let u, v;
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] === startNode) u = i;
      else if (this.nodes[i] === targetNode) v = i;
    }

    if (this.next[u][v] === null) return []; // this should never happen

    let path = [startNode];
    while (u != v) {
      u = this.next[u][v];
      path.push(this.nodes[u]);
    }
    return path;
  }

  // TODO: remove this once we are sure that floyd warshall works
  getPathToNodeOld(startNode, targetNode) {
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

      // if this is a ride, also set the rideID (for display purposes)
      // this.rideName = `Ride ${++rideID}`;

      // for rides, let us store how many people are in queue at each second (basically every 30 frames)
      this.queueHist = [0];
      this.maxQueueSoFar = 1;
    }
  }

  setRideName(rideID) {
    this.rideName = `Ride ${rideID}`;
  }

  reset() {
    // reset the queue, cooldowns, riding agents
    this.queue = new PriorityQueue((a, b) => a[0] > b[0]);
    this.ridingAgents = [];
    this.runCooldowns = [];
    this.turnoverCooldown = 0;
    this.queueHist = [0];
    this.maxQueueSoFar = 1;
    
    // should we rng the parameters again?
  }

  getType() {
    return this.type;
  }

  getDisplayInfo() {
    // make sure that this node is actually a ride node
    if (this.type == 'ride') {
      let displayInfo = `=== ${this.rideName} ===\nCapacity: ${this.capacity}\nRuntime: ${this.runtime}\nTurnover: ${this.turnover}\nPeople in queue: ${this.queue.size()}`;
      return displayInfo;
    }
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

  drawGraph() {
    if (this.type == "ride") {
      // possible TODO: make this not rely on magic numbers

      const maxHist = max(this.queueHist);
      const minHist = 0;

      // draw the max and min values
      textAlign(CENTER, BASELINE);
      fill(0);
      text(maxHist, 15, 125)
      textAlign(CENTER, BOTTOM);
      text(minHist, 15, 195)
      
      // draw the x and y axes
      stroke(0);
      strokeWeight(0.5);
      line(15, 130, 15, 180);
      line(15, 180, 120, 180);

      // draw the actual graph
      stroke(255);
      noFill();
      beginShape();
      for (let i = 0; i < MAX_RIDE_SAMPLES; i++) {
        if (i < this.queueHist.length) {
          const xtick = (120 - 15) / MAX_RIDE_SAMPLES * i + 15;
          const ytick = 180 - (180 - 130) / (maxHist - minHist) * (this.queueHist[i] - minHist);
          vertex(xtick, ytick);
        }
      }
      endShape();
    }
  }

  update() {
    // update the queueHist with the newest queue data
    if (frameCount % Math.floor(RIDE_SAMPLE_UPDATE_FREQ * FRAME_RATE) == 0) {
      // this.maxQueueSoFar = max(this.queueHist);
      this.queueHist.push(this.queue.size());
      if (this.queueHist.length > MAX_RIDE_SAMPLES) {
        // remove the oldest data point
        this.queueHist.shift();
      }
    }

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