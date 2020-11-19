// constants
const WIDTH = 800;
const HEIGHT = 600;

const AGENT_RADIUS = 7;
const NODE_RADIUS = 10;

const NODE_TYPES = ["junc", "ride", "entrance"];

// simulation parameters
const ARRIVAL_PROB = 0.2;
const DEPARTURE_PROB = 0.3;
const MOVE_SPEED = 120; // moves x units per second

// resources and images
const ICON_WIDTH = 40;
const ICON_HEIGHT = 40;

const RIDE_IMG_PATH = "res/roller-coaster.png";
const ENTRANCE_IMG_PATH = "res/gate.jpg";

// creator mode constants
const SELECT_RADIUS = 13;

const TEXT_PADDING_TOP = 15;
const TEXT_PADDING_RIGHT = 10;

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// function distance(x1, y1, x2, y2) {
//   return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
// }