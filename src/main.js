// global vars
let simMap;
let entrance;
let rides;
let agents = [];
let isRunning = false;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  // set framerate at 30fps
  frameRate(30);
  createMap();
}

function draw() {
  background(128);

  // update function
  simMap.drawMap();

  drawRunning();

  if (isRunning) {
    updateLoop();
  }

  // keep drawing agents
  for (let agent of agents) {
    agent.draw();
  }
}

function mouseClicked() {
  isRunning = !isRunning;
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
  rides = [n1, n3, n4, n6, n7, n8, n9, n10, n12];
  entrance = e;

  // initialise the actual map
  let nodes = [e, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12];
  simMap = new SimMap(nodes, entrance, rides);
  simMap.connectNode(1, 2);
  simMap.connectNode(2, 3);
  simMap.connectNode(3, 0);
  simMap.connectNode(0, 4);
  simMap.connectNode(4, 5);
  simMap.connectNode(5, 6);
  simMap.connectNode(2, 7);
  simMap.connectNode(3, 8);
  simMap.connectNode(8, 4);
  simMap.connectNode(5, 9);
  simMap.connectNode(8, 11);
  simMap.connectNode(7, 10);
  simMap.connectNode(9, 12);
  simMap.connectNode(10, 12);
  simMap.connectNode(12, 11);
  simMap.connectNode(11, 10);
}

function updateLoop() {
  addAgents();

  for (let agent of agents) {
    agent.update();
  }

  removeAgents();
}

function addAgents() {
  if (Math.random() < ARRIVAL_PROB) {
    console.log("entered");
    const agent = new Agent(simMap);
    agents.push(agent);
  }
}

function removeAgents() {
  agents = agents.filter((agt) => agt.agentState != AgentStates.EXITED);
}