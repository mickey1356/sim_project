// constants
const TICK_RATE = 200; // ticks the update function every xxx milliseconds
const ANIM_RATE = 400; // do a draw operation every xxx milliseconds
const CLEAN_RATE = 1200; // clean all the exited nodes every xxx milliseconds
const CANVAS_PADDING_SIDE_PERCENT = 0.15;
const CANVAS_PADDING_TOP_PERCENT = 0.1;
const CANVAS_PADDING_BTM_PERCENT = 0.2;


// simulation parameters
const ARRIVAL_PROB = 0.1;
const DEPARTURE_PROB = 0.2;

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}