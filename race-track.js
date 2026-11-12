// race-track.js — the sled track for Mt Hermon Racing.
//
// The track is a long loop made of short, straight pieces called "segments"
// (RACE.segmentLength long each, settings in rules.js). Each segment can bend left
// or right a little ("curve") and go up or down ("y" = height). Put a few hundred
// of them in a row and you get a curvy, hilly track.
//
// Things beside the track (pine trees, snowmen, flags, cabins) are "sprites": each
// one sits on a segment, at a sideways spot called "offset":
//   0 = the middle of the track, 1 = the right edge, -1 = the left edge, 2 = twice as far out.
//
// Every phone builds exactly the same track, because the "random" numbers below
// always come out the same (they start from the same seed).

const TRACK = {
  segments: [],
  length: 0, // the length of one lap, in track units
};

// How big each kind of sprite is in the world (width, height), and whether a sled
// crashes into it. (race-draw.js draws them.)
const SPRITE_SIZES = {
  pine:     { w: 800,  h: 1500, solid: true },
  bigPine:  { w: 1100, h: 2100, solid: true },
  snowman:  { w: 480,  h: 720,  solid: true },
  rock:     { w: 600,  h: 340,  solid: true },
  cabin:    { w: 1700, h: 1300, solid: true },
  flagRed:  { w: 150,  h: 560,  solid: false }, // slalom flags: thin, you just knock them
  flagBlue: { w: 150,  h: 560,  solid: false },
};

// The segment at a distance along the track (any distance: it loops around every lap).
function findSegment(z) {
  const count = TRACK.segments.length;
  const index = Math.floor(z / RACE.segmentLength) % count;
  return TRACK.segments[(index + count) % count];
}

// A distance along the track, wrapped into one lap (0 … TRACK.length).
function wrapTrack(z) {
  return ((z % TRACK.length) + TRACK.length) % TRACK.length;
}

(function buildTrack() {
  const segments = TRACK.segments;
  const segmentLength = RACE.segmentLength;

  // Smooth changes, so curves and hills start and end gently (no sudden jolts).
  const easeIn = (a, b, t) => a + (b - a) * t * t;
  const easeInOut = (a, b, t) => a + (b - a) * (-Math.cos(t * Math.PI) / 2 + 0.5);

  function lastY() {
    return segments.length === 0 ? 0 : segments[segments.length - 1].p2.world.y;
  }

  function addSegment(curve, y) {
    const n = segments.length;
    segments.push({
      index: n,
      // p1 = the near end of this piece, p2 = the far end. (camera + screen get filled in while drawing.)
      p1: { world: { y: lastY(), z: n * segmentLength }, camera: {}, screen: {} },
      p2: { world: { y, z: (n + 1) * segmentLength }, camera: {}, screen: {} },
      curve,
      sprites: [],
      dark: Math.floor(n / 3) % 2 === 1, // light and dark stripes, so you can see how fast you go
    });
  }

  // One stretch of track: it eases INTO the curve, HOLDS it, then eases back OUT.
  // `height` = how far it climbs (negative = downhill), in segment lengths.
  function addRoad(enter, hold, leave, curve, height) {
    const startY = lastY();
    const endY = startY + height * segmentLength;
    const total = enter + hold + leave;
    for (let n = 0; n < enter; n++) addSegment(easeIn(0, curve, n / enter), easeInOut(startY, endY, n / total));
    for (let n = 0; n < hold; n++) addSegment(curve, easeInOut(startY, endY, (enter + n) / total));
    for (let n = 0; n < leave; n++) addSegment(easeInOut(curve, 0, n / leave), easeInOut(startY, endY, (enter + hold + n) / total));
  }

  // ----- The course -----
  // addRoad(ease in, hold, ease out, curve, height)
  //   curve: 2 = gentle, 4 = medium, 6 = sharp (minus = to the left)
  //   height: 20 = small hill, 40 = big hill (minus = downhill)
  addRoad(50, 50, 50, 0, 0);       // the starting straight
  addRoad(50, 50, 50, 2, 0);       // a gentle right
  addRoad(50, 50, 50, 0, 40);      // up a big hill
  addRoad(50, 50, 50, -4, 20);     // a left bend, still climbing
  addRoad(25, 50, 25, -2, -10);    // S-bends…
  addRoad(25, 50, 25, 4, 10);
  addRoad(25, 50, 25, 2, -10);
  addRoad(25, 50, 25, -3, 0);
  addRoad(100, 100, 100, 0, -60);  // the long sled run, all downhill
  addRoad(50, 50, 50, 5, 0);       // a sharp right at the bottom
  addRoad(25, 25, 25, 0, 20);      // two bumps
  addRoad(25, 25, 25, 0, -20);
  addRoad(50, 100, 50, -4, 30);    // a long left, climbing
  addRoad(50, 50, 50, 3, -30);     // a right, going down
  addRoad(50, 50, 50, 0, 0);
  addRoad(50, 50, 50, -2, -lastY() / segmentLength); // back to the starting height
  addRoad(50, 50, 50, 0, 0);       // the final straight to the line

  TRACK.length = segments.length * segmentLength;

  // ----- Things beside the track -----
  // "Random" numbers that come out the same on every phone (a seeded random generator).
  let seed = 7;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }
  const side = () => (random() < 0.5 ? -1 : 1);
  const add = (n, type, offset) => { if (segments[n]) segments[n].sprites.push({ type, offset }); };

  for (let n = 10; n < segments.length - 5; n++) {
    // A forest on both sides: near trees every few segments, and more trees farther out.
    if (n % 3 === 0) add(n, random() < 0.25 ? "bigPine" : "pine", side() * (1.35 + random() * 1.6));
    if (n % 5 === 0) add(n, "bigPine", side() * (3 + random() * 3));
    // Slalom flags right at the edges, red on the left, blue on the right.
    if (n % 16 === 0) { add(n, "flagRed", -1.12); add(n, "flagBlue", 1.12); }
    if (n % 70 === 35) add(n, "snowman", side() * (1.4 + random() * 0.6));
    if (n % 90 === 60) add(n, "rock", side() * (1.3 + random() * 0.8));
    if (n % 240 === 120) add(n, "cabin", side() * 3.2);
  }
  // Snowmen cheering at the start line.
  add(4, "snowman", -1.5);
  add(4, "snowman", 1.5);
})();
