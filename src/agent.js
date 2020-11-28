const AgentStates = {
  "ENTERED": 100, // just entered the park
  "MOVING": 101, // moving to the target ride
  "QUEUING": 102, // queuing for the ride
  "EXITING": 103, // exiting the park (moving to the exit)
  "REACHED": 104, // reached the target ride
  "FINISHED": 105, // done with the current ride
  "EXITED": 106, // exited the park (should remove from agents)
};
Object.freeze(AgentStates);

class Agent {
  constructor(map, priority = false, grp = false) {
    this.map = map;

    this.agentState = AgentStates.ENTERED;

    this.x = map.entrance.x;
    this.y = map.entrance.y;
    this.priority = priority;
    this.grp = grp

    this.curNode = map.entrance;
	
    if (this.priority == true){
      this.fill = 'blue';
    } else if (this.grp == true){
      this.fill = 'yellow';
    } else {
      this.fill = 'green';
    }
  }

  nextDestination() {
    if (this.agentState != AgentStates.ENTERED && Math.random() < DEPARTURE_PROB) {
      this.targetNode = this.map.entrance;
      this.agentState = AgentStates.EXITING;
      this.fill = "white";
    } else {
      const rides = this.map.rides.filter((r) => !(r === this.curNode));
      if (rides.length == 0) {
        // just exit (since this means that there's only 1 ride)
        this.targetNode = this.map.entrance;
        this.agentState = AgentStates.EXITING;
        this.fill = "white";
      } else {
        const choice = Math.floor(Math.random() * rides.length);
        this.targetNode = rides[choice];
        this.agentState = AgentStates.MOVING;
      }
    }
    // find a path there
    this.path = this.map.getPathToNode(this.curNode, this.targetNode);
    this.path.shift();

    // start moving towards the next node
    this.startMoving();
  }

  // moves to the next node on the path
  startMoving() {
    // set the current node (to the next node)
    this.curNode = this.path[0];

    // set the target coords (to the next node)
    this.targetX = this.path[0].x;
    this.targetY = this.path[0].y;

    this.initialX = this.x;
    this.initialY = this.y;

    this.lerpT = 0; // varies from 0 to 1
    this.timeRequired = dist(this.x, this.y, this.targetX, this.targetY) / MOVE_SPEED;
  }

  update() {
    switch (this.agentState) {
      case AgentStates.ENTERED:
        // pick a random ride to head to
        this.nextDestination();
        break;
      case AgentStates.MOVING: case AgentStates.EXITING:
        this.lerpT += deltaTime / (1000 * this.timeRequired);

        if (this.lerpT >= 1) {
          this.x = this.targetX;
          this.y = this.targetY;
          if (this.curNode === this.targetNode) {
            if (this.agentState == AgentStates.MOVING) this.agentState = AgentStates.REACHED;
            else this.agentState = AgentStates.EXITED;
          } else {
            // not yet reached the target node
            // drop the front node (we're there already), and start moving again
            this.path.shift();
            this.startMoving();
          }
        }
        break;
      case AgentStates.REACHED:
        // enqueue this agent into the ride (ride will deal with them)
        // the second argument is the priority value, higher priority will be first to get to ride
        this.targetNode.enqueue(this, 0);
        break;
      case AgentStates.FINISHED:
        this.nextDestination();
        break;
    }
  }

  // putting this here just to keep track of when the agent starts queuing
  startQueueing() {
    this.agentState = AgentStates.QUEUING;
  }

  // putting this here just to keep track of when the agent reaches the end of the queue
  startRiding() {

  }

  doneRiding() {
    this.agentState = AgentStates.FINISHED;
  }

  draw() {
    stroke(0);
    strokeWeight(0.5);
    fill(this.fill);
    if (this.agentState == AgentStates.MOVING || this.agentState == AgentStates.EXITING) {
      this.x = lerp(this.initialX, this.targetX, this.lerpT);
      this.y = lerp(this.initialY, this.targetY, this.lerpT);
    }
	if (this.priority == true){
		ellipse(this.x, this.y, 1.5*AGENT_RADIUS);
	} else {
		ellipse(this.x, this.y, AGENT_RADIUS);
		}
  }
}