// global vars
let simMap;
let simTimer;
let animTimer;
let cleanTimer;
let canvasWidth, canvasHeight;
let isRunning = false;
let entrance; // keep track of the entrance/exit node
let agents = [];
let rides = [];

// entry point function
(function () {
  createMap();

  simTimer = window.setInterval(simUpdate, TICK_RATE);
  // cleanTimer = window.setInterval(cleanup, CLEAN_RATE)
  // animTimer = window.setInterval(drawLoop, ANIM_RATE);
  setup();
})();

function createMap() {
  // initialise a basic map (0,0 top left; 1,1 btm right)
  let e = new MapNode("entrance", 0.5, 0.7);
  let n1 = new MapNode("ride", 0.2, 0.6);
  let n2 = new MapNode("ride", 0.3, 0.6);
  let n3 = new MapNode("ride", 0.4, 0.6);
  let n4 = new MapNode("ride", 0.6, 0.6);
  let n5 = new MapNode("ride", 0.7, 0.6);
  let n6 = new MapNode("ride", 0.8, 0.6);
  let n7 = new MapNode("ride", 0.3, 0.4);
  let n8 = new MapNode("ride", 0.5, 0.5);
  let n9 = new MapNode("ride", 0.7, 0.4);
  let n10 = new MapNode("ride", 0.4, 0.3);
  let n11 = new MapNode("ride", 0.5, 0.4);
  let n12 = new MapNode("ride", 0.6, 0.3);

  // set the global vars
  rides = [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12];
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

function toggleSim() {
  isRunning = !isRunning;

  // simulation indicator colour
  if (isRunning) {
    d3.select("#surface").style("background-color", "#999");
    animTimer = window.setInterval(drawLoop, ANIM_RATE);
  }
  else {
    d3.select("#surface").style("background-color", "#ccc");
    window.clearInterval(animTimer);
  }
}

function setup() {
  // initialise simulation-based variables
  isRunning = false;
  window.clearInterval(simTimer);
  // window.clearInterval(animTimer);
  simTimer = window.setInterval(simUpdate, TICK_RATE);
  // animTimer = window.setInterval(drawLoop, ANIM_RATE);

  // reset crowds
  agents = [];

  // clear and draw the canvas
  var drawSurface = document.getElementById("surface");
  const w = window.innerWidth;
  const h = window.innerHeight;

  canvasWidth = (w - 2 * w * CANVAS_PADDING_SIDE_PERCENT);
  canvasHeight = (h - h * (CANVAS_PADDING_TOP_PERCENT + CANVAS_PADDING_BTM_PERCENT));

  drawSurface.style.width = canvasWidth + "px";
  drawSurface.style.height = canvasHeight + "px";
  drawSurface.style.left = CANVAS_PADDING_SIDE_PERCENT * w + "px";
  drawSurface.style.top = CANVAS_PADDING_TOP_PERCENT * h + "px";
  drawSurface.style.border = "thin solid black";
  drawSurface.style.position = "absolute";
  drawSurface.innerHTML = "";

  console.log(drawSurface.style.width + ", " + drawSurface.style.height)

  surface = d3.select("#surface");
  surface.selectAll("*").remove();

  // draw the map (represented as a graph)
  simMap.drawMap(surface, canvasWidth, canvasHeight);

  // drawLoop();
}

function drawLoop() {
  // basically just draw the agents
  let allAgents = surface.selectAll(".agent").data(agents);
  allAgents.exit().remove();

  let newAgents = allAgents.enter().append("g").attr("class", "agent");
  newAgents.append("circle")
    .attr("cx", (agt) => agt.x)
    .attr("cy", (agt) => agt.y)
    .attr("r", 7)
    .attr("fill", (agt) => agt.fill);
  
  let agentReps = allAgents.selectAll("circle");
  agentReps.attr("fill", (agt) => agt.fill);
  agentReps.transition()
    .duration(ANIM_RATE).ease(d3.easeLinear)
    .attr("cx", (agt) => agt.targetX)
    .attr("cy", (agt) => agt.targetY)
    .on("end", (agt) => agt.reachedDest());
  
  removeAgents();
}

function addAgents() {
  if (Math.random() < ARRIVAL_PROB) {
    console.log("entered");
    let agent = new Agent(simMap, canvasWidth, canvasHeight);
    agents.push(agent);
  }
}

function removeAgents() {
  const allAgents = surface.selectAll(".agent").data(agents);
  const exitedAgents = allAgents.filter((d) => d.state == EXITED);
  exitedAgents.remove();
  // remove agents whose state is EXITED
  agents = agents.filter((agt) => agt.agentState != EXITED);
}

function simUpdate() {
  if (isRunning) {
    // add agents
    addAgents();

    // update agents
    for (let agt of agents) {
      agt.update();
    }

    // update rides

    // update surface
    // drawLoop();

    // remove agents
    // removeAgents();
  }
}