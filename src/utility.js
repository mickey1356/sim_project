// constants
const WIDTH = 800;
const HEIGHT = 600;

const AGENT_RADIUS = 7;
const NODE_RADIUS = 10;

const NODE_TYPES = ["junc", "ride", "entrance"];

// display information parameters
const DISPLAY_HEIGHT = 200;
const DISPLAY_WIDTH = 150;
const HOVER_RADIUS = 20;

const MAX_RIDE_SAMPLES = 100; // keep up to this amount of queue-data
const MAX_AGT_SAMPLES = 100; // keep up to this amount of agent-data
const RIDE_SAMPLE_UPDATE_FREQ = 0.1 // update the graph every x seconds

let rideID = 0;

// simulation parameters
const ARRIVAL_PROB = 0.2;
const DEPARTURE_PROB = 0.3;
const PRIORITY_PROB = 0.1;
const GRP_PROB = 0.9;
const MOVE_SPEED = 100; // moves x units per second

// resources and images
const ICON_WIDTH = 40;
const ICON_HEIGHT = 40;

const RIDE_IMG_PATH = "res/roller-coaster.png";
const ENTRANCE_IMG_PATH = "res/gate.jpg";

// creator mode constants
const SELECT_RADIUS = 13;

const TEXT_PADDING_TOP = 15;
const TEXT_PADDING_RIGHT = 10;

// application constants
const FRAME_RATE = 30;

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random()*16)];
		}
	
  return color;
}

// change the stuff below as you see fit
// returns an even number uniformly from 6 - 12
function getRandomCapacity() {
  return 2 * (Math.floor(Math.random() * 4) + 3);
}

// returns a number uniformly from 1 to 5
function getRandomRuntime() {
  return Math.floor(Math.random() * 5) + 1;
}

// returns a number uniformly from 1 to 5
function getRandomTurnover() {
  return Math.floor(Math.random() * 5) + 1;
}

// taken from stackoverflow: https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript
// because im too lazy to implement a priority queue in javascript
const PQtop = 0;
const PQparent = i => ((i + 1) >>> 1) - 1;
const PQleft = i => (i << 1) + 1;
const PQright = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[PQtop];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > PQtop) {
      this._swap(PQtop, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[PQtop] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > PQtop && this._greater(node, PQparent(node))) {
      this._swap(node, PQparent(node));
      node = PQparent(node);
    }
  }
  _siftDown() {
    let node = PQtop;
    while (
      (PQleft(node) < this.size() && this._greater(PQleft(node), node)) ||
      (PQright(node) < this.size() && this._greater(PQright(node), node))
    ) {
      let maxChild = (PQright(node) < this.size() && this._greater(PQright(node), PQleft(node))) ? PQright(node) : PQleft(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}
