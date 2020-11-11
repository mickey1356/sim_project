// an agent takes one of these states
const IN_LINE = 100;
const IN_RIDE = 101;
const ENTERED = 102; // just entered the park
const WALKING = 103; // moving towards target node
const EXITING = 104; // heading towards the entrance node
const EXITED = 105; // exited the park (waiting to be destroyed)
const THINKING = 106; // deciding where to head next
const REACHED = 107; // reached a node (may be interim or target)

class Agent {
  constructor(map, width, height) {
    this.map = map;
    this.width = width;
    this.height = height;

    this.agentState = ENTERED;

    this.x = map.entrance.x * width;
    this.y = map.entrance.y * height;

    this.curNode = map.entrance;

    // for debugging purposes
    this.fill = getRandomColor();
  }

  reachedDest() {
    if (this.agentState == WALKING || this.agentState == EXITING) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.path.shift();
      if (this.path.length == 0) {
        if (this.agentState == WALKING) {
          // reached the ride we want to head to
          this.curNode = this.targetNode;
          // enqueue yourself and wait until the ride dequeues you
          this.agentState = IN_LINE;
        } else if (this.agentState == EXITING) {
          this.agentState = EXITED;
          this.targetX = 0.5 * this.width;
          this.targetY = 0.8 * this.height;
          this.fill = "blue";
        }
      } else {
        this.targetX = this.path[0].x * this.width;
        this.targetY = this.path[0].y * this.height;
      }
    }
  }

  dequeue() {
    this.agentState = THINKING;
  }

  pickNextRide() {
    if (this.agentState != ENTERED && Math.random() < DEPARTURE_PROB) {
      // leave the park
      this.targetNode = this.map.entrance;
      this.agentState = EXITING;
      this.fill = "green";
    } else {
      // decide where to go
      const rides = this.map.rides.filter((r) => !(r === this.curNode));
      const choice = Math.floor(Math.random() * rides.length);
      this.targetNode = rides[choice];
      this.agentState = WALKING;
    }
    // find a path there
    this.path = this.map.getPathToNode(this.curNode, this.targetNode);
    this.path.shift();
    // set the target coords (to the next node)
    this.targetX = this.path[0].x * this.width;
    this.targetY = this.path[0].y * this.height;

  }

  update() {
    switch (this.agentState) {
      case ENTERED:
        // decide where to go next
        this.pickNextRide();
        break;
      // states that should not do anything
      case IN_LINE: case IN_RIDE:
        // this.fill = getRandomColor();
        this.pickNextRide();
        break;
      case THINKING:
        this.pickNextRide();
        break;
    }
  }
}