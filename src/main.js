// global vars
let simMap;
let nodes = [];
let connections = [];
let entrance;
let rides;
let agents = [];
let isRunning = false;

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
  const pBtn = createP();
  const createBtn = createButton("Toggle creator/simulator mode");
  const defaultMapBtn = createButton("Create default map");
  const resetMapBtn = createButton("Clear map");

  startBtn.parent(divs);
  resetBtn.parent(divs);
  pBtn.parent(divs);
  createBtn.parent(divs);
  defaultMapBtn.parent(divs);
  resetMapBtn.parent(divs);

  startBtn.mouseClicked(toggleSim);
  resetBtn.mouseClicked(resetSim);
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

    drawDisplay();

    drawRunning();

    if (isRunning) {
      updateLoop();
    }

    // keep drawing agents
    for (let agent of agents) {
      agent.draw();
    }
  } else {
    // creator mode loop
    fill(255);
    textAlign(RIGHT, TOP);
    text("====instructions====\n\
          click to place a new node\ndrag from one node to another to form a route\nclick node to toggle its type\nevery ride must be reachable from the entrance\n\
          =====colour key=====\n\
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

function drawDisplay() {
  // draw a rectangle at the top left to display info
  textAlign(LEFT, TOP);
  fill(255, 255, 255, 60);
  stroke(0);
  strokeWeight(0.5);
  rect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

  for (let node of nodes) {
    if (dist(node.x, node.y, mouseX, mouseY) < HOVER_RADIUS && node.type == "ride") {
      textAlign(LEFT);
      noStroke();
      fill(0);
      text(node.getDisplayInfo(), 5, 35, DISPLAY_WIDTH - 5, DISPLAY_HEIGHT - 5);
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

function createMap() {
  // reset the rideID
  rideID = 0;

  // initialise a basic map (0,0 top left; 1,1 btm right)
  let e = new MapNode("entrance", 0.5, 0.7);
  let n1 = new MapNode("ride", 0.2, 0.6);
  let n2 = new MapNode("junc", 0.3, 0.6);
  let n3 = new MapNode("ride", 0.4, 0.6);
  let n4 = new MapNode("ride", 0.6, 0.6);
  let n5 = new MapNode("junc", 0.7, 0.6);
  let n6 = new MapNode("ride", 0.8, 0.6);
  let n7 = new MapNode("ride", 0.3, 0.4);
  let n8 = new MapNode("ride", 0.5, 0.5);
  let n9 = new MapNode("ride", 0.7, 0.4);
  let n10 = new MapNode("ride", 0.4, 0.3);
  let n11 = new MapNode("junc", 0.5, 0.4);
  let n12 = new MapNode("ride", 0.6, 0.3);

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
}

function addAgents() {
  if (Math.random() < ARRIVAL_PROB) {
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
  agents = agents.filter((agt) => agt.agentState != AgentStates.EXITED);
}