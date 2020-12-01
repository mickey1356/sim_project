// global vars
let simMap;
let nodes = [];
let connections = [];
let entrance;
let rides;
let agents = [];
let isRunning = false;
let showStats = true;

// statistics
let totalVisitors = 0;

let totalTimeSpent = 0;
let totalTimeQueue = 0;
let totalRides = 0;
let timeSpentHist = [];
let timeQueueHist = [];
let rideHist = [];

// creator mode
let creatorMode = false;
let selected = false;
let selectedNodeIndex = -1;
let selecting = false;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  // set framerate at 30fps
  frameRate(FRAME_RATE);
  createMap();

  // create some basic control buttons
  createP();
  const divs = createDiv();
  divs.class("buttons");

  const startBtn = createButton("Start/Pause Simulation");
  const resetBtn = createButton("Reset Simulation");
  const statsBtn = createButton("Show/Hide global statistics");
  const pBtn = createP();
  const createBtn = createButton("Toggle creator/simulator mode");
  const defaultMapBtn = createButton("Create default map");
  const resetMapBtn = createButton("Clear map");

  startBtn.parent(divs);
  resetBtn.parent(divs);
  statsBtn.parent(divs);
  pBtn.parent(divs);
  createBtn.parent(divs);
  defaultMapBtn.parent(divs);
  resetMapBtn.parent(divs);

  startBtn.mouseClicked(toggleSim);
  resetBtn.mouseClicked(resetSim);
  statsBtn.mouseClicked(toggleStats);
  createBtn.mouseClicked(toggleCreate);
  defaultMapBtn.mouseClicked(defaultMap);
  resetMapBtn.mouseClicked(resetMap);
}

function draw() {
  background(100);

  if (simMap) {
    simMap.drawMap(creatorMode);
  }

  // update function
  if (!creatorMode) {

    if (isRunning) {
      updateLoop();
    }

    // keep drawing agents
    for (let agent of agents) {
      agent.draw();
    }

    drawRunning();

    drawDisplay();

    if (showStats) {
      drawStats();
    }

  } else {
    // creator mode loop
    fill(255);
    textAlign(RIGHT, TOP);
    text("=== Instructions ===\n\
          Click to place a new node\nDrag from one node to another to form a route\nClick node to toggle its type\nEvery ride must be reachable from the entrance\n\
          ==== Colour Key ====\n\
          orange: entrance (max 1)\ncyan: ride\nblack: junction", WIDTH - TEXT_PADDING_RIGHT, TEXT_PADDING_TOP)

    let flag = false;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (dist(node.x, node.y, mouseX, mouseY) < SELECT_RADIUS) {
        noStroke();
        fill(200, 200, 200, 120);
        circle(node.x, node.y, 2 * SELECT_RADIUS);
        flag = true;
        if (!selected && mouseIsPressed) {
          selectedNodeIndex = i;
          selected = true;
        } else if (selected && !mouseIsPressed) {
          // make sure this new connection isn't an existing one
          let flag = true;
          for (let connection of connections) {
            if ((connection[0] == i && connection[1] == selectedNodeIndex) || (connection[0] == selectedNodeIndex && connection[1] == i)) flag = false;
          }
          if (flag) {
            connections.push([selectedNodeIndex, i]);
            simMap.connectNode(selectedNodeIndex, i);
          }
        }
      }
    }
    selecting = flag;

    if (selected) {
      const node = nodes[selectedNodeIndex];
      stroke("#f5220f");
      line(node.x, node.y, mouseX, mouseY);
      if (!mouseIsPressed) {
        selected = false;
        if (dist(node.x, node.y, mouseX, mouseY) < SELECT_RADIUS) {
          node.toggleType();
        }
      }
    }
  }
}

function mouseClicked() {
  if (creatorMode && !selecting && mouseX > 0 && mouseY > 0 && mouseX < WIDTH && mouseY < HEIGHT) {
    const node = new MapNode("ride", mouseX / WIDTH, mouseY / HEIGHT);
    nodes.push(node);
    if (simMap == null) {
      simMap = new SimMap(nodes, connections);
    }
  }
}

function checkMap() {
  if (simMap == null || !simMap.checkMap()) {
    alert("Invalid map");
    creatorMode = true;
  } else {
    creatorMode = false;
  }
}

function toggleSim() {
  checkMap();
  isRunning = !isRunning;
}

function resetSim() {
  isRunning = false;
  agents = [];

  // reset statistics as well
  totalVisitors = 0;
  totalTimeSpent = 0;
  totalTimeQueue = 0;
  totalRides = 0;
  timeSpentHist = [];
  timeQueueHist = [];
  rideHist = [];


  for (const node of nodes) {
    node.reset();
  }
}

function defaultMap() {
  if (creatorMode) createMap();
}

function resetMap() {
  if (creatorMode) {
    rideID = 0;
    simMap = null;
    nodes = [];
    connections = [];
  }
}

function toggleCreate() {
  resetSim();
  creatorMode = !creatorMode;

  if (!creatorMode) checkMap();
}

function toggleStats() {
  showStats = !showStats;
}

function drawDisplay() {
  for (let node of nodes) {
    if (dist(node.x, node.y, mouseX, mouseY) < HOVER_RADIUS && node.type == "ride") {
      // draw a rectangle at the top left to display info
      fill(255, 255, 255, 60);
      stroke(0);
      strokeWeight(0.5);
      rect(0, 30, DISPLAY_WIDTH, DISPLAY_HEIGHT);
      
      textAlign(LEFT, TOP);
      noStroke();
      fill(0);
      text(node.getDisplayInfo(), 10, 40, DISPLAY_WIDTH - 5, DISPLAY_HEIGHT - 5);
      // text(node.runCooldowns, 5, 200);
      // text(node.turnoverCooldown, 5, 220);
      node.drawGraph();
      // this is just to avoid overdrawing of display info (in case multiple nodes are very close to one another)
      break;
    }
  }
}

function drawRunning() {  
  strokeWeight(0.5);
  stroke(0);
  if (isRunning) {
    fill("#2a1");
    triangle(10, 7.5, 20, 15, 10, 22.5);
  } else {
    fill("#f08205");
    rect(8, 7.5, 5, 15);
    rect(16, 7.5, 5, 15);
  }
}

function drawStats() {
  // draw a rectangle near the bottom of the screen to display statistics
  fill(155);
  stroke(0);
  strokeWeight(0.5);
  rect((WIDTH - STATS_WIDTH) / 2, HEIGHT - STATS_HEIGHT, STATS_WIDTH, STATS_HEIGHT);

  textAlign(CENTER, TOP);
  noStroke();
  fill(0);

  const exitedVisitors = max(1, totalVisitors - agents.length);
  
  // show: total number of visitors, visitors currently in park
  statsString = `=== Global Stats ===
  Total visitors (lifetime): ${totalVisitors}
  Current visitors: ${agents.length}
  Average time in park (per agent): ${(totalTimeSpent / exitedVisitors).toFixed(3)}
  Average waiting time (per agent): ${(totalTimeQueue / exitedVisitors).toFixed(3)}
  Average rides visited (per agent): ${(totalRides / exitedVisitors).toFixed(3)}`;

  text(statsString, WIDTH / 2, HEIGHT - STATS_HEIGHT + 10);

  const leftBorder = (WIDTH - STATS_WIDTH) / 2;
  const btmBorder = HEIGHT;

  // possible todo: remove the magic numbers
  drawGraph("time in park", timeSpentHist, leftBorder + 25, btmBorder - 60, 25);
  drawGraph("time queuing", timeQueueHist, leftBorder + 150, btmBorder - 60, 10);
  drawGraph("rides taken", rideHist, leftBorder + 275, btmBorder - 60, 5);

}

function drawGraph(title, data, x, y, defMax) {
  // set the default max so you can sort of have some sort of constant reference point
  const maxHist = max(defMax, int(ceil(max(data))));
  const minHist = 0;

  // draw title and max values
  textAlign(CENTER, BOTTOM);
  fill(0);
  noStroke();
  text(title, x + GG_WIDTH / 2, y - 10)
  text(maxHist, x, y);

  // draw the x and y axes
  stroke(0);
  strokeWeight(1);
  line(x, y, x, y + GG_HEIGHT);
  line(x, y + GG_HEIGHT, x + GG_WIDTH, y + GG_HEIGHT);

  // draw the actual graph
  stroke(255, 0, 0);
  strokeWeight(0.5);
  noFill();
  beginShape();
  for (let i = 0; i < MAX_AGT_SAMPLES; i++) {
    if (i < data.length) {
      const xtick = (GG_WIDTH) / MAX_AGT_SAMPLES * i + x;
      const ytick = y + GG_HEIGHT - (GG_HEIGHT) / (maxHist - minHist) * (data[i] - minHist);
      vertex(xtick, ytick);
    }
  }
  endShape();
}

function createMap() {
  // reset the rideID
  rideID = 0;

  // initialise a basic map (0,0 top left; 1,1 btm right)
  let e = new MapNode("entrance", 0.5, 0.6);
  let n1 = new MapNode("ride", 0.2, 0.5);
  let n2 = new MapNode("junc", 0.3, 0.5);
  let n3 = new MapNode("ride", 0.4, 0.5);
  let n4 = new MapNode("ride", 0.6, 0.5);
  let n5 = new MapNode("junc", 0.7, 0.5);
  let n6 = new MapNode("ride", 0.8, 0.5);
  let n7 = new MapNode("ride", 0.3, 0.3);
  let n8 = new MapNode("ride", 0.5, 0.4);
  let n9 = new MapNode("ride", 0.7, 0.3);
  let n10 = new MapNode("ride", 0.4, 0.2);
  let n11 = new MapNode("junc", 0.5, 0.3);
  let n12 = new MapNode("ride", 0.6, 0.2);

  // set the global vars
  // rides = [n1, n3, n4, n6, n7, n8, n9, n10, n12];
  // entrance = e;

  // initialise the actual map
  nodes = [e, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12];
  connections = [[1, 2], [2, 3], [3, 0], [0, 4], [4, 5], [5, 6], [2, 7], [3, 8], [8, 4], [5, 9], [8, 11], [7, 10], [9, 12], [10, 12], [12, 11], [11, 10]];
  simMap = new SimMap(nodes, connections);
}

function updateLoop() {
  addAgents();

  for (let agent of agents) {
    agent.update();
  }

  simMap.updateRides();

  removeAgents();
  
  // update the histories with the calculated data
  const exitedVisitors = max(1, totalVisitors - agents.length);
  if (frameCount % Math.floor(AGT_SAMPLE_UPDATE_FREQ * FRAME_RATE) == 0) {
    // this.queueHist.push(this.queue.size());
    timeSpentHist.push(totalTimeSpent / exitedVisitors);
    timeQueueHist.push(totalTimeQueue / exitedVisitors);
    rideHist.push(totalRides / exitedVisitors);
    if (timeSpentHist.length > MAX_AGT_SAMPLES) {
      // remove the oldest data point
      timeSpentHist.shift();
      timeQueueHist.shift();
      rideHist.shift();
    }
  }

}

function addAgents() {
  if (Math.random() < ARRIVAL_PROB) {

    // increment number of visitors
    totalVisitors++;

	  if (Math.random() < PRIORITY_PROB) {
      console.log("priority entered");
      const agent = new Agent(simMap, priority = true, grp = false);	
      agents.push(agent);
		
    } else if (Math.random() < GRP_PROB){
      //for (var i = 0; i < Math.floor(Math.random() * 4)+1; i++) {
      const agent = new Agent(simMap, priority = false, grp = true);	
      agents.push(agent);
      // need to instantiate a new agent, otherwise, it'll just be one agent being updated twice per loop
      // possible to identify groupings within the agents? maybe some sort of id
      // agents.push(agent);
      //}
      console.log("group entered");
    } else {
      console.log("entered");
      const agent = new Agent(simMap, priority = false, grp = false);	
      agents.push(agent);
    }
  }
}

function removeAgents() {
  exitedAgents = agents.filter((agt) => agt.agentState == AgentStates.EXITED);
  agents = agents.filter((agt) => agt.agentState != AgentStates.EXITED);

  // let times = frameCount * exitedAgents.length;
  // let ridesTaken = 0;
  // let queueTimes = 0;
  for (let agt of exitedAgents) {
    totalTimeSpent += (frameCount - agt.enteredTime) / FRAME_RATE;
    totalTimeQueue += agt.queueTime;
    totalRides += agt.numRidesTaken;
  }
}